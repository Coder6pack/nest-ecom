import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { boolean, z } from 'zod'

export const RegisterBodySchema = UserSchema.pick({
	name: true,
	email: true,
	password: true,
	phoneNumber: true,
})
	.extend({
		confirmPassword: z.string().min(6).max(255),
		code: z.string().length(6),
	})
	.strict()
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password do not match',
				path: ['confirmPassword'],
			})
		}
	})

export const RegisterResSchema = UserSchema.omit({
	password: true,
	totpSecret: true,
})

export const VerificationCodeSchema = z.object({
	id: z.number().positive(),
	email: z.string().email(),
	code: z.string().length(50),
	type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
	expiresAt: z.date(),
	createdAt: z.date(),
})

export const SendOTPBodySchema = VerificationCodeSchema.pick({
	email: true,
	type: true,
}).strict()

export const LoginBodySchema = UserSchema.pick({
	email: true,
	password: true,
}).strict()

export const LoginResSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})
export const RefreshTokenBodySchema = z
	.object({
		refreshToken: z.string(),
	})
	.strict()

export const RefreshTokenResSchema = LoginBodySchema

export const DeviceSchema = z.object({
	id: z.number(),
	userId: z.number(),
	userAgent: z.string(),
	ip: z.string(),
	lastActive: z.date(),
	createdAt: z.date(),
	isActive: z.boolean(),
})

export const RoleSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	isActive: z.boolean(),
	createdById: z.number().nullable(),
	updatedById: z.number().nullable(),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const RefreshTokenSchema = z.object({
	token: z.string(),
	userId: z.number(),
	deviceId: z.number(),
	expiresAt: z.date(),
	createdAt: z.date(),
})

export const LogoutBodySchema = RefreshTokenBodySchema

export type LogoutBodyType = RefreshTokenBodyType
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type RoleType = z.infer<typeof RoleSchema>
export type DeviceType = z.infer<typeof DeviceSchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type RefreshTokenResType = LoginResType
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type SendOPTBodyType = z.infer<typeof SendOTPBodySchema>
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type VerifiCationCodeType = z.infer<typeof VerificationCodeSchema>
