import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { DeviceType, RefreshTokenType, RegisterBodyType, RoleType, VerifiCationCodeType } from './auth.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async createUser(
		user: Pick<UserType, 'name' | 'email' | 'phoneNumber' | 'password' | 'roleId'>,
	): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
		return await this.prismaService.user.create({
			data: user,
			omit: {
				password: true,
				totpSecret: true,
			},
		})
	}
	async createUserIncludeRole(
		user: Pick<UserType, 'name' | 'email' | 'phoneNumber' | 'password' | 'roleId' | 'avatar'>,
	): Promise<UserType & { role: RoleType }> {
		return await this.prismaService.user.create({
			data: user,
			include: {
				role: true,
			},
		})
	}

	async createVerificationCode(
		payload: Pick<VerifiCationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>,
	): Promise<VerifiCationCodeType> {
		console.log('payload', payload)
		return this.prismaService.verificationCode.upsert({
			where: {
				email: payload.email,
			},
			create: payload,
			update: {
				code: payload.code,
				expiresAt: payload.expiresAt,
			},
		})
	}

	async findUniqueVerificationCode(
		value:
			| { email: string }
			| { id: number }
			| {
					email: string
					code: string
					type: TypeOfVerificationCodeType
			  },
	): Promise<VerifiCationCodeType | null> {
		return this.prismaService.verificationCode.findUnique({
			where: value,
		})
	}
	async findUniqueIncludeRole(
		payload: { email: string } | { id: number },
	): Promise<(UserType & { role: RoleType }) | null> {
		return this.prismaService.user.findUnique({
			where: payload,
			include: {
				role: true,
			},
		})
	}

	async createRefreshToken(data: Omit<RefreshTokenType, 'createdAt'>): Promise<RefreshTokenType> {
		return this.prismaService.refreshToken.create({
			data,
		})
	}

	async createDevice(
		data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
	): Promise<DeviceType> {
		return this.prismaService.device.create({
			data,
		})
	}

	findUniqueRefreshTokenINcludeUserRole(
		refreshToken: string,
	): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
		return this.prismaService.refreshToken.findUnique({
			where: {
				token: refreshToken,
			},
			include: {
				user: {
					include: {
						role: true,
					},
				},
			},
		})
	}

	updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
		return this.prismaService.device.update({
			where: {
				id: deviceId,
			},
			data,
		})
	}

	deleteRefreshToken(token: string) {
		return this.prismaService.refreshToken.delete({
			where: {
				token,
			},
		})
	}
}
