import { Injectable } from '@nestjs/common'
import { PermissionRepository } from './permission.repo'
import { CreatePermissionBodyType } from './permission.model'

@Injectable()
export class PermissionService {
	constructor(private readonly PermissionRepository: PermissionRepository) {}

	create({ data, userId }: { data: CreatePermissionBodyType; userId: number }) {
		return this.PermissionRepository.create({ data, userId })
	}
}
