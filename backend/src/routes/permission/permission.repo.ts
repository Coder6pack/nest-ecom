import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePermissionBodyType, PermissionType } from './permission.model'

@Injectable()
export class PermissionRepository {
	constructor(private readonly prismaService: PrismaService) {}

	create({ data, userId }: { data: CreatePermissionBodyType; userId: number }): Promise<PermissionType> {
		return this.prismaService.permission.create({
			data: {
				...data,
				createdById: userId,
				updatedById: userId,
			},
		})
	}
}
