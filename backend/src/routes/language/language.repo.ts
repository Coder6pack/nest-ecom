import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
	CreateLanguageBodyType,
	CreateLanguageResType,
	GetLanguageDetailResType,
	GetLanguagesResType,
	LanguageType,
	UpdateLanguageBodyType,
	UpdateLanguageResType,
} from './language.model'
import { MessageResType } from 'src/shared/models/response.model'

@Injectable()
export class LanguageRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(): Promise<GetLanguagesResType> {
		const data = await this.prismaService.language.findMany()
		const totalItem = await this.prismaService.language.count()
		return { data, totalItem }
	}

	async createLanguage({
		data,
		userId,
	}: {
		data: CreateLanguageBodyType
		userId: number
	}): Promise<Omit<LanguageType, 'deletedAt' | 'updatedAt' | 'updatedById'>> {
		return this.prismaService.language.create({
			data: {
				id: data.id,
				name: data.name,
				updatedById: userId,
				createdById: userId,
			},
			omit: {
				deletedAt: true,
				updatedAt: true,
			},
		})
	}
	getDetail(id: string): Promise<GetLanguageDetailResType | null> {
		return this.prismaService.language.findUnique({
			where: {
				id,
				deletedAt: null,
			},
		})
	}
	update({
		body,
		id,
		userId,
	}: {
		body: UpdateLanguageBodyType
		id: string
		userId: number
	}): Promise<UpdateLanguageResType> {
		return this.prismaService.language.update({
			where: {
				id,
				deletedAt: null,
			},
			data: {
				name: body.name,
				updatedById: userId,
			},
		})
	}

	async delete({ id, isHard, userId }: { id: string; isHard?: boolean; userId?: number }): Promise<LanguageType> {
		return isHard
			? this.prismaService.language.delete({
					where: {
						id,
					},
				})
			: this.prismaService.language.update({
					where: {
						id,
						deletedAt: null,
					},
					data: {
						deletedAt: new Date(),
						updatedById: userId,
					},
				})
	}
}
