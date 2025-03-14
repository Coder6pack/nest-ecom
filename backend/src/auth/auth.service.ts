import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { RoleService } from './role.service'
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { RegisterBodyType, SendOPTBodyType } from './auth.model'
import { AuthRepository } from './auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { addMilliseconds, milliseconds } from 'date-fns'
import ms from 'ms'
import envConfig from 'src/shared/config'

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
		const verificationCode = await this.authRepository.createVerificationCode({
			email: body.email,
			type: body.type,
			code,
			expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
		})
		return verificationCode
	}
}
