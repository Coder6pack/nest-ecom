import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { TokenService } from '../services/token.service'
import { REQUEST_USER_KEY } from '../constants/auth.constant'

@Injectable()
export class AccessTokenGuard implements CanActivate {
	constructor(private readonly tokenService: TokenService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const accessToken = request.headers['authorization']?.split(' ')[1]
		if (!accessToken) {
			throw new UnauthorizedException('Access token is required')
		}
		try {
			const decodeAccessToken = await this.tokenService.verifyAccessToken(accessToken as string)
			request[REQUEST_USER_KEY] = decodeAccessToken
			return true
		} catch {
			throw new UnauthorizedException('Invalid access token')
		}
	}
}
