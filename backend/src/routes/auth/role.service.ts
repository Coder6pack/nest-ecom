import { Injectable } from '@nestjs/common'
import { RoleName } from 'src/shared/constants/role.constant'
import { RoleType } from 'src/shared/models/shared-role.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RoleService {
	private roleId: number | null = null
	constructor(private readonly prismaService: PrismaService) {}

	async getRoleId() {
		if (this.roleId) {
			return this.roleId
		}
		const role: RoleType = await this.prismaService
			.$queryRaw`SELECT * FROM "Role" WHERE name = ${RoleName.Client} AND "deletedAt" IS NULL LIMIT 1`.then(
			(res: RoleType[]) => {
				if (res.length === 0) {
					throw new Error('Role not found')
				}
				return res[0]
			},
		)
		this.roleId = role.id
		return role.id
	}
}
