import { createZodDto } from 'nestjs-zod'
import { RegisterBodySchema, RegisterResSchema, SendOTPBodySchema, VerificationCodeSchema } from './auth.model'

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class RegisterResDTO extends createZodDto(RegisterResSchema) {}
export class VerificationCodeDTO extends createZodDto(VerificationCodeSchema) {}
export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
