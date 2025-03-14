import { z } from 'zod'
import { UserStatus } from '../constants/auth.constant'

export const UserSchema = z.object({
	id: z.number(),
	name: z.string().min(1).max(255),
	email: z.string().email(),
	password: z.string().min(6).max(255),
	phoneNumber: z.string().min(9).max(15),
	totpSecret: z.string().nullable(),
	avatar: z.string().nullable(),
	status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
	roleId: z.number().positive(),
	createdById: z.number().nullable(),
	updatedById: z.number().nullable(),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type UserType = z.infer<typeof UserSchema>
