import { createZodDto } from 'nestjs-zod'
import {
	CreateLanguageBodySchema,
	CreateLanguageResSchema,
	GetLanguageDetailParamSchema,
	GetLanguageDetailResSchema,
	GetLanguagesResSchema,
	UpdateLanguageBodySchema,
	UpdateLanguageResSchema,
} from './language.model'

export class CreateLanguageBodyDTO extends createZodDto(CreateLanguageBodySchema) {}
export class CreateLanguageResDTO extends createZodDto(CreateLanguageResSchema) {}
export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema) {}
export class GetLanguageDetailParamDTO extends createZodDto(GetLanguageDetailParamSchema) {}
export class GetLanguageDetailResDTO extends createZodDto(GetLanguageDetailResSchema) {}
export class UpdateLanguageBodyDTO extends createZodDto(UpdateLanguageBodySchema) {}
export class UpdateLanguageResDTO extends createZodDto(UpdateLanguageResSchema) {}
