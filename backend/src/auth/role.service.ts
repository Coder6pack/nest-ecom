import { Injectable } from '@nestjs/common'
import { RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RoleService {
	private roleId: number | null = null
	constructor(private readonly prismaService: PrismaService) {}

	async getRoleId() {
		if (this.roleId) {
			return this.roleId
		}
		const role = await this.prismaService.role.findFirstOrThrow({
			where: {
				name: RoleName.Client,
			},
		})
		this.roleId = role.id
		return this.roleId
	}
}
