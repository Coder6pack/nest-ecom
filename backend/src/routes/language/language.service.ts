import { Injectable } from '@nestjs/common'
import { LanguageRepository } from './language.repo'
import { CreateLanguageBodyType, UpdateLanguageBodyType } from './language.model'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { LanguageAlreadyExistsException } from './language.error'
import { NotFoundRecordException } from 'src/shared/error'

@Injectable()
export class LanguageService {
	constructor(private readonly languageRepository: LanguageRepository) {}

	findAll() {
		return this.languageRepository.findAll()
	}
	create({ body, userId }: { body: CreateLanguageBodyType; userId: number }) {
		try {
			return this.languageRepository.createLanguage({ data: body, userId })
		} catch (error) {
			if (isUniqueConstraintPrismaError(error)) {
				throw LanguageAlreadyExistsException
			}
			throw error
		}
	}
	async getDetail(id: string) {
		const language = await this.languageRepository.getDetail(id)
		if (!language) {
			throw NotFoundRecordException
		}
		return language
	}

	update({ body, id, userId }: { body: UpdateLanguageBodyType; id: string; userId: number }) {
		try {
			return this.languageRepository.update({ body, id, userId })
		} catch (error) {
			if (isNotFoundPrismaError(error)) {
				throw NotFoundRecordException
			}
			throw error
		}
	}

	async delete({ id, userId }: { id: string; userId?: number }) {
		try {
			await this.languageRepository.delete({ id, isHard: true, userId })
			return {
				message: 'Language deleted successfully',
			}
		} catch (error) {
			if (isNotFoundPrismaError(error)) {
				throw NotFoundRecordException
			}
			throw error
		}
	}
}
