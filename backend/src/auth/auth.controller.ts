import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDTO, SendOTPBodyDTO } from './auth.dto'

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
}
