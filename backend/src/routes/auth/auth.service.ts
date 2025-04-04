import { HttpException, Injectable } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { RoleService } from './role.service'
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import {
	ForgotPasswordBodyType,
	LoginBodyType,
	LogoutBodyType,
	RefreshTokenBodyType,
	RegisterBodyType,
	SendOPTBodyType,
} from './auth.model'
import { AuthRepository } from './auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/token.type'
import {
	EmailAlreadyExistsException,
	EmailNotFoundException,
	FailedToSendOTPException,
	InvalidOTPException,
	InvalidPasswordException,
	OTPExpiredException,
	RefreshTokenAlreadyUsedException,
	UnauthorizedAccessException,
} from './error.model'

@Injectable()
export class AuthService {
	constructor(
		private readonly hashingService: HashingService,
		private readonly roleService: RoleService,
		private readonly authRepository: AuthRepository,
		private readonly sharedUserRepository: SharedUserRepository,
		private readonly emailService: EmailService,
		private readonly tokenService: TokenService,
	) {}

	async validateVerificationCode({
		email,
		code,
		type,
	}: {
		email: string
		code: string
		type: TypeOfVerificationCodeType
	}) {
		const verificationCode = await this.authRepository.findUniqueVerificationCode({
			email_code_type: {
				email,
				code,
				type,
			},
		})
		if (!verificationCode) {
			throw InvalidOTPException
		}
		if (verificationCode.expiresAt < new Date()) {
			throw OTPExpiredException
		}
		return verificationCode
	}

	async register(body: RegisterBodyType) {
		try {
			await this.validateVerificationCode({ email: body.email, code: body.code, type: TypeOfVerificationCode.REGISTER })

			const clientRoleId = await this.roleService.getRoleId()
			const hashPassword = await this.hashingService.hash(body.password)
			const [user] = await Promise.all([
				this.authRepository.createUser({
					name: body.name,
					email: body.email,
					password: hashPassword,
					roleId: clientRoleId,
					phoneNumber: body.phoneNumber,
				}),
				this.authRepository.deleteVerificationCode({
					email_code_type: {
						email: body.email,
						code: body.code,
						type: TypeOfVerificationCode.REGISTER,
					},
				}),
			])
			return user
		} catch (error) {
			console.log('error', error)
			if (isUniqueConstraintPrismaError(error)) {
				throw EmailAlreadyExistsException
			}
			throw error
		}
	}

	async sendOTP(body: SendOPTBodyType) {
		// Kiểm tra xem user đã tồn tại hay chưa
		const user = await this.sharedUserRepository.findUnique({
			email: body.email,
		})
		if (body.type === TypeOfVerificationCode.REGISTER && user) {
			throw EmailAlreadyExistsException
		}
		if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user) {
			throw EmailNotFoundException
		}
		// Tại mã OTP
		const code = generateOTP()
		const expiresAt = addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN))
		const verificationCode = await this.authRepository.createVerificationCode({
			email: body.email,
			type: body.type,
			code,
			expiresAt,
		})
		console.log(verificationCode)
		const { error } = await this.emailService.sendOTP({ email: body.email, code })
		if (error) {
			throw FailedToSendOTPException
		}
		return verificationCode
	}

	async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
		const [accessToken, refreshToken] = await Promise.all([
			await this.tokenService.signAccessToken({
				userId,
				deviceId,
				roleId,
				roleName,
			}),
			this.tokenService.signRefreshToken({ userId }),
		])
		const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
		await this.authRepository.createRefreshToken({
			userId,
			token: refreshToken,
			expiresAt: new Date(decodeRefreshToken.exp * 1000),
			deviceId,
		})
		return { accessToken, refreshToken }
	}
	async login(body: LoginBodyType & { userAgent: string; ip: string }) {
		// Verify user in database
		const user = await this.authRepository.findUniqueIncludeRole({
			email: body.email,
		})
		if (!user) {
			throw EmailAlreadyExistsException
		}
		// Create record device
		const device = await this.authRepository.createDevice({
			userId: user.id,
			userAgent: body.userAgent,
			ip: body.ip,
		})
		const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
		if (!isPasswordMatch) {
			throw InvalidPasswordException
		}
		return await this.generateTokens({
			userId: user.id,
			deviceId: device.id,
			roleId: user.roleId,
			roleName: user.role.name,
		})
	}
	async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
		try {
			// Decode the refresh token
			const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
			// Check refreshToken in database
			const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenINcludeUserRole(refreshToken)
			if (!refreshTokenInDb) {
				throw RefreshTokenAlreadyUsedException
			}
			const {
				deviceId,
				user: {
					roleId,
					role: { name: roleName },
				},
			} = refreshTokenInDb
			// Update device
			const $updateDevice = this.authRepository.updateDevice(deviceId, { userAgent, ip })
			// Delete the refresh token from the database
			const $deleteRefreshToken = this.authRepository.deleteRefreshToken(refreshToken)
			// Generate new access and refresh tokens
			const $generateToken = this.generateTokens({ userId, deviceId, roleId, roleName })

			// Promise all to handle all function
			const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $generateToken])
			return tokens
		} catch (error) {
			console.log(error)
			if (error instanceof HttpException) {
				throw error
			}
			throw UnauthorizedAccessException
		}
	}

	async logout({ refreshToken }: LogoutBodyType) {
		// Check refreshToken is verify?
		await this.tokenService.verifyRefreshToken(refreshToken)
		// Delete refreshToken
		const { deviceId } = await this.authRepository.deleteRefreshToken(refreshToken)
		// Update device
		await this.authRepository.updateDevice(deviceId, {
			isActive: false,
		})
		return {
			message: 'Logout successfully',
		}
	}

	async forgotPassword(body: ForgotPasswordBodyType) {
		const { email, newPassword, code } = body
		// Kiem tra email co ton tai khong
		const user = await this.sharedUserRepository.findUnique({
			email,
		})
		if (!user) {
			throw EmailNotFoundException
		}
		// Kiem tra ma OTP co ton tai khong
		await this.validateVerificationCode({
			email,
			code,
			type: TypeOfVerificationCode.FORGOT_PASSWORD,
		})

		const hashedPassword = await this.hashingService.hash(newPassword)
		await Promise.all([
			this.authRepository.updateUser(
				{ email },
				{
					password: hashedPassword,
				},
			),
			this.authRepository.deleteVerificationCode({
				email_code_type: {
					email,
					code,
					type: TypeOfVerificationCode.FORGOT_PASSWORD,
				},
			}),
		])
		return {
			message: 'Change password successfully',
		}
	}
}
