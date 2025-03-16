import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { RoleService } from './role.service'
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { RegisterBodyType, SendOPTBodyType } from './auth.model'
import { AuthRepository } from './auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'

@Injectable()
export class AuthService {
	constructor(
		private readonly hashingService: HashingService,
		private readonly roleService: RoleService,
		private readonly authRepository: AuthRepository,
		private readonly sharedUserRepository: SharedUserRepository,
	) {}

	async register(body: RegisterBodyType) {
		try {
			const verificationCode = await this.authRepository.findUniqueVerificationCode({
				email: body.email,
				code: body.code,
				type: TypeOfVerificationCode.REGISTER,
			})

			if (!verificationCode) {
				throw new UnprocessableEntityException([
					{
						message: 'Mã OTP không tồn tại',
						path: 'code',
					},
				])
			}
			console.log('expires', verificationCode.expiresAt.toISOString())
			console.log('now', new Date().toISOString())
			if (verificationCode.expiresAt < new Date()) {
				throw new UnprocessableEntityException([
					{
						message: 'Mã OTP đã hết hạn',
						path: 'code',
					},
				])
			}
			const clientRoleId = await this.roleService.getRoleId()
			const hashPassword = await this.hashingService.hash(body.password)
			return await this.authRepository.createUser({
				name: body.name,
				email: body.email,
				password: hashPassword,
				roleId: clientRoleId,
				phoneNumber: body.phoneNumber,
			})
		} catch (error) {
			console.log('error', error)
			if (isUniqueConstraintPrismaError(error)) {
				throw new UnprocessableEntityException([
					{
						path: 'email',
						message: 'Email đã tồn tại',
					},
				])
			}
			throw error
		}
	}

	async sendOTP(body: SendOPTBodyType) {
		// Kiểm tra xem user đã tồn tại hay chưa
		const user = await this.sharedUserRepository.findUnique({
			email: body.email,
		})
		if (user) {
			throw new UnprocessableEntityException([
				{
					path: 'email',
					message: 'Email đã tồn tại',
				},
			])
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
		return verificationCode
	}
}
