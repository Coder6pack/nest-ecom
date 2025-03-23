import { Body, Controller, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDTO, RegisterBodyDTO, SendOTPBodyDTO } from './auth.dto'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() body: RegisterBodyDTO) {
		return this.authService.register(body)
	}

	@Post('otp')
	sendOTP(@Body() body: SendOTPBodyDTO) {
		return this.authService.sendOTP(body)
	}

	@Post('login')
	login(@Body() body: LoginBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
		return this.authService.login({
			...body,
			ip,
			userAgent,
		})
	}
}
