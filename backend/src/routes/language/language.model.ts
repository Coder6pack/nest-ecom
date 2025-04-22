import { z } from 'zod'

export const LanguageSchema = z.object({
	id: z.string().max(10),
	name: z.string(),
	createdById: z.number().nullable(),
	updatedById: z.number().nullable(),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const CreateLanguageBodySchema = LanguageSchema.pick({
	id: true,
	name: true,
}).strict()

export const CreateLanguageResSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdById: z.number(),
	createdAt: z.date(),
})

export const GetLanguagesResSchema = z.object({
	data: z.array(LanguageSchema),
	totalItem: z.number(),
})

export const GetLanguageDetailParamSchema = z
	.object({
		id: z.string().max(10),
	})
	.strict()

export const GetLanguageDetailResSchema = LanguageSchema
export const UpdateLanguageBodySchema = LanguageSchema.pick({
	name: true,
}).strict()
export const UpdateLanguageResSchema = LanguageSchema

export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>
export type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>
export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>
export type GetLanguageDetailParamType = z.infer<typeof GetLanguageDetailParamSchema>
export type GetLanguagesResType = z.infer<typeof GetLanguagesResSchema>
export type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>
export type LanguageType = z.infer<typeof LanguageSchema>
export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>
