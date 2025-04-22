import { Body, Controller, Post } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { CreatePermissionBodyDTO, GetPermissionResDTO } from './permission.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('permission')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	// create permission
	@Post('/create')
	@ZodSerializerDto(GetPermissionResDTO)
	createPermission(@Body() body: CreatePermissionBodyDTO, @ActiveUser('userId') userId: number) {
		return this.permissionService.create({ data: body, userId })
	}
}
