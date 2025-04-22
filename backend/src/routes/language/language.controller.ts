import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import {
	CreateLanguageBodyDTO,
	CreateLanguageResDTO,
	GetLanguageDetailResDTO,
	GetLanguagesResDTO,
	UpdateLanguageBodyDTO,
	UpdateLanguageResDTO,
} from './language.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { LanguageService } from './language.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('languages')
export class LanguageController {
	constructor(private readonly languageService: LanguageService) {}

	// Get all languages
	@Get('/')
	@ZodSerializerDto(GetLanguagesResDTO)
	findAll() {
		return this.languageService.findAll()
	}

	// Create a new language
	@Post('/create')
	@ZodSerializerDto(CreateLanguageResDTO)
	createLanguage(@Body() body: CreateLanguageBodyDTO, @ActiveUser('userId') userId: number) {
		return this.languageService.create({ body, userId })
	}

	// Get a language by ID
	@Get(':id')
	@ZodSerializerDto(GetLanguageDetailResDTO)
	getDetail(@Param('id') id: string) {
		return this.languageService.getDetail(id)
	}

	// Update language by id
	@Put(':id')
	@ZodSerializerDto(UpdateLanguageResDTO)
	updateLanguage(@Body() body: UpdateLanguageBodyDTO, @Param('id') id: string, @ActiveUser('userId') userId: number) {
		return this.languageService.update({ body, id, userId })
	}

	// Delete language by id
	@Delete(':id')
	@ZodSerializerDto(MessageResDTO)
	deleteLanguage(@Param('id') id: string, @ActiveUser('userId') userId: number) {
		return this.languageService.delete({ id, userId })
	}
}
