import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
	CreateRoleBodyType,
	CreateRoleResType,
	GetRoleDetailResType,
	GetRoleQueryType,
	GetRolesResType,
	RoleWithPermissionsType,
	UpdateRoleBodyType,
} from './role.model'
import { RoleType } from 'src/shared/models/shared-role.model'

@Injectable()
export class RoleRepository {
	constructor(private readonly prismaService: PrismaService) {}

	// Get list role
	async getList({ page, limit }: GetRoleQueryType): Promise<GetRolesResType> {
		const skip = (page - 1) * limit
		const take = limit
		const [totalItem, data] = await Promise.all([
			this.prismaService.role.count({
				where: {
					deletedAt: null,
				},
			}),
			this.prismaService.role.findMany({
				where: {
					deletedAt: null,
				},
				skip,
				take,
			}),
		])
		return {
			data,
			totalItem,
			page,
			limit,
			totalPage: Math.ceil(totalItem / limit),
		}
	}
	// Get role detail
	async getDetail(id: number): Promise<RoleWithPermissionsType | null> {
		return await this.prismaService.role.findUnique({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				permissions: true,
			},
		})
	}
	// Create role
	async create({ data, userId }: { data: CreateRoleBodyType; userId: number }): Promise<CreateRoleResType> {
		return await this.prismaService.role.create({
			data: {
				...data,
				createdById: userId,
				updatedById: userId,
			},
		})
	}
	// Update role
	async update({
		data,
		id,
		userId,
	}: {
		data: UpdateRoleBodyType
		id: number
		userId: number
	}): Promise<RoleWithPermissionsType> {
		return await this.prismaService.role.update({
			where: {
				id,
				deletedAt: null,
			},
			data: {
				name: data.name,
				description: data.description,
				isActive: data.isActive,
				permissions: {
					set: data.permissionIds.map((id) => ({ id })),
				},
				updatedById: userId,
			},
			include: {
				permissions: true,
			},
		})
	}
	// Delete role
	async delete({ id, userId, isHard }: { id: number; userId: number; isHard?: boolean }): Promise<RoleType> {
		return isHard
			? this.prismaService.role.delete({
					where: {
						id,
					},
				})
			: this.prismaService.role.update({
					where: {
						id,
						deletedAt: null,
					},
					data: {
						deletedAt: new Date(),
						deletedById: userId,
					},
				})
	}
}
