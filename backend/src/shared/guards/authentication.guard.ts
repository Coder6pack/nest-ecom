import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY, AuthTypeDecoratorType } from '../decorators/auth.decorator'
import { AccessTokenGuard } from './access-token.guard'
import { APIKeyGuard } from './api-key.guard'
import { AuthItem, ConditionGuard } from '../constants/auth.constant'

@Injectable()
export class AuthenticationGuard implements CanActivate {
	private readonly authTypeGuardMap: Record<string, CanActivate> = {
		[AuthItem.Bearer]: this.accessTokenGuard,
		[AuthItem.APIKey]: this.apiKeyGuard,
		[AuthItem.None]: { canActivate: () => true },
	}
	constructor(
		private readonly reflector: Reflector,
		private readonly accessTokenGuard: AccessTokenGuard,
		private readonly apiKeyGuard: APIKeyGuard,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorType | undefined>(AUTH_TYPE_KEY, [
			context.getHandler(),
			context.getClass(),
		]) ?? { authTypes: [AuthItem.Bearer], options: { condition: ConditionGuard.And } }

		const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType])
		let error = new UnauthorizedException()
		if (authTypeValue.options.condition === ConditionGuard.Or) {
			for (const instance of guards) {
				const isCanActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
					error = err
					return false
				})
				if (isCanActivate) return true
			}
			throw error
		} else {
			for (const instance of guards) {
				const isCanActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
					error = err
					return false
				})
				if (!isCanActivate) throw new UnauthorizedException()
			}
			return true
		}
	}
}
