import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

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

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResSchema = UserSchema.omit({
	password: true,
	totpSecret: true,
})

export type RegisterResType = z.infer<typeof RegisterResSchema>

export const VerificationCodeSchema = z.object({
	id: z.number().positive(),
	email: z.string().email(),
	code: z.string().length(50),
	type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
	expiresAt: z.date(),
	createdAt: z.date(),
})

export type VerifiCationCodeType = z.infer<typeof VerificationCodeSchema>

export const SendOTPBodySchema = VerificationCodeSchema.pick({
	email: true,
	type: true,
}).strict()

export type SendOPTBodyType = z.infer<typeof SendOTPBodySchema>
