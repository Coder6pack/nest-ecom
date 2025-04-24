import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { PermissionService } from './permission.service'
import {
	CreatePermissionBodyDTO,
	GetPermissionDetailResDTO,
	GetPermissionQueryDTO,
	GetPermissionsResDTO,
	UpdatePermissionBodyDTO,
	UpdatePermissionResDTO,
} from './permission.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('permission')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	// get list permissions
	@Get()
	@ZodSerializerDto(GetPermissionsResDTO)
	getList(@Query() query: GetPermissionQueryDTO) {
		console.log('query', query)
		return this.permissionService.getList({
			page: query.page,
			limit: query.limit,
		})
	}

	// Get permission by ID
	@Get(':id')
	@ZodSerializerDto(GetPermissionDetailResDTO)
	getById(@Param('id') id: string) {
		return this.permissionService.getDetail(id)
	}
	// create permission
	@Post('/create')
	@ZodSerializerDto(GetPermissionDetailResDTO)
	createPermission(@Body() body: CreatePermissionBodyDTO, @ActiveUser('userId') userId: number) {
		return this.permissionService.create({ data: body, userId })
	}

	// Update permission
	@Put(':id')
	@ZodSerializerDto(UpdatePermissionResDTO)
	updatePermission(
		@Body() body: UpdatePermissionBodyDTO,
		@Param('id') id: string,
		@ActiveUser('userId') userId: number,
	) {
		return this.permissionService.update({
			data: body,
			userId,
			id,
		})
	}

	// Delete permission
	@Delete(':id')
	@ZodSerializerDto(MessageResDTO)
	deletePermission(@Param('id') id: string, @ActiveUser('userId') userId: number) {
		return this.permissionService.delete({ id, userId })
	}
}
