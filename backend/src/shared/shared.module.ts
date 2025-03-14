import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard'
import { APIKeyGuard } from './guards/api-key.guard'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from './guards/authentication.guard'
import { SharedUserRepository } from './repositories/shared-user.repo'

const shareService = [PrismaService, HashingService, TokenService, SharedUserRepository]

@Global()
@Module({
	providers: [
		...shareService,
		AccessTokenGuard,
		APIKeyGuard,
		{
			provide: APP_GUARD,
			useClass: AuthenticationGuard,
		},
	],
	exports: shareService,
	imports: [JwtModule],
})
export class SharedModule {}
