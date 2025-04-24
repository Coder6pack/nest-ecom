import { Injectable } from '@nestjs/common'
import { PermissionRepository } from './permission.repo'
import { CreatePermissionBodyType, GetPermissionQueryType, UpdatePermissionBodyType } from './permission.model'
import { NotFoundPermissionException } from './permission.error'

@Injectable()
export class PermissionService {
	constructor(private readonly permissionRepository: PermissionRepository) {}

	// Get all permissions
	getList({ page = '1', limit = '10' }: GetPermissionQueryType) {
		const skip = (Number(page) - 1) * Number(limit)
		return this.permissionRepository.getList({ page, limit, skip })
	}

	// Get detail
	getDetail(id: string) {
		return this.permissionRepository.getDetail(Number(id))
	}

	// Create permission
	create({ data, userId }: { data: CreatePermissionBodyType; userId: number }) {
		return this.permissionRepository.create({ data, userId })
	}

	// Update permission
	update({ userId, id, data }: { userId: number; id: string; data: UpdatePermissionBodyType }) {
		const permissionId = Number(id)
		return this.permissionRepository.update({ userId, id: permissionId, data })
	}

	// Delete permission
	async delete({ id, userId }: { id: string; userId: number }) {
		const permissionId = Number(id)
		const permission = await this.permissionRepository.getDetail(permissionId)
		if (!permission) {
			throw NotFoundPermissionException
		}
		await this.permissionRepository.delete({ id: permissionId, userId, isHard: true })
		return {
			message: 'Delete permission successfully',
		}
	}
}
