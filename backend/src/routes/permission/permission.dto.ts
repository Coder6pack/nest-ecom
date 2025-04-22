import { createZodDto } from 'nestjs-zod'
import {
	CreatePermissionBodySchema,
	GetPermissionQuerySchema,
	GetPermissionDetailResSchema,
	GetPermissionsResSchema,
} from './permission.model'

export class GetPermissionQueryDTO extends createZodDto(GetPermissionQuerySchema) {}

export class GetPermissionResDTO extends createZodDto(GetPermissionDetailResSchema) {}

export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodySchema) {}

export class GetPermissionsResDTO extends createZodDto(GetPermissionsResSchema) {}
