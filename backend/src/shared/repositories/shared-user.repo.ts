import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'
import { UserType } from '../models/shared-user.model'

@Injectable()
export class SharedUserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findUnique(payload: { email: string } | { id: number }): Promise<UserType | null> {
		return this.prismaService.user.findUnique({
			where: payload,
		})
	}
}
