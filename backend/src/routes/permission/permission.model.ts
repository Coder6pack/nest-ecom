import { permission } from 'process'
import { HTTPMethod } from 'src/shared/constants/http.constant'
import { z } from 'zod'

export const PermissionSchema = z.object({
	id: z.number(),
	name: z.string().max(500),
	description: z.string(),
	path: z.string().max(1000),
	method: z.enum([
		HTTPMethod.GET,
		HTTPMethod.POST,
		HTTPMethod.PUT,
		HTTPMethod.DELETE,
		HTTPMethod.PATCH,
		HTTPMethod.HEAD,
		HTTPMethod.OPTIONS,
	]),
	createdById: z.number().nullable(),
	updatedById: z.number().nullable(),
	deletedById: z.number().nullable(),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const CreatePermissionBodySchema = PermissionSchema.pick({
	name: true,
	path: true,
	method: true,
}).strict()

export const GetPermissionDetailResSchema = PermissionSchema

export const GetPermissionQuerySchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
})

export const GetPermissionsResSchema = GetPermissionQuerySchema.extend({
	data: z.array(PermissionSchema),
	totalItem: z.number(),
})

export const UpdatePermissionBodySchema = PermissionSchema.pick({
	name: true,
	description: true,
	path: true,
	method: true,
}).strict()

export const UpdatePermissionResSchema = PermissionSchema

export type UpdatePermissionResType = PermissionType
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
export type GetPermissionsResType = z.infer<typeof GetPermissionsResSchema>
export type GetPermissionQueryType = z.infer<typeof GetPermissionQuerySchema>
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>
export type PermissionType = z.infer<typeof PermissionSchema>
