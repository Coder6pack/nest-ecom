import { createZodDto } from 'nestjs-zod'
import {
	GetAuthorizationResSchema,
	LoginBodySchema,
	LoginResSchema,
	LogoutBodySchema,
	RefreshTokenBodySchema,
	RefreshTokenResSchema,
	RegisterBodySchema,
	RegisterResSchema,
	SendOTPBodySchema,
	VerificationCodeSchema,
} from './auth.model'

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class RegisterResDTO extends createZodDto(RegisterResSchema) {}
export class VerificationCodeDTO extends createZodDto(VerificationCodeSchema) {}
export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class LoginResDTO extends createZodDto(LoginResSchema) {}
export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}
export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}
export class GetAuthorizationResDTO extends createZodDto(GetAuthorizationResSchema) {}
