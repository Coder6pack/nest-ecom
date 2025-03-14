import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterBodyType, VerifiCationCodeType } from './auth.model'
import { UserType } from 'src/shared/models/shared-user.model'

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createUser(
		user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>,
	): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
		return await this.prismaService.user.create({
			data: user,
			omit: {
				password: true,
				totpSecret: true,
			},
		})
	}

	async createVerificationCode(
		payload: Pick<VerifiCationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>,
	): Promise<VerifiCationCodeType> {
		return this.prismaService.verificationCode.upsert({
			where: {
				email: payload.email,
			},
			create: payload,
			update: {
				code: payload.code,
			},
		})
	}
}
