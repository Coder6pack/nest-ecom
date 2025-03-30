import { Body, Controller, Get, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
	GetAuthorizationResDTO,
	LoginBodyDTO,
	LoginResDTO,
	LogoutBodyDTO,
	RefreshTokenBodyDTO,
	RefreshTokenResDTO,
	RegisterBodyDTO,
	RegisterResDTO,
	SendOTPBodyDTO,
} from './auth.dto'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { GoogleService } from './google.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly googleService: GoogleService,
	) {}

	@Post('register')
	@IsPublic()
	@ZodSerializerDto(RegisterResDTO)
	register(@Body() body: RegisterBodyDTO) {
		return this.authService.register(body)
	}

	@Post('otp')
	@IsPublic()
	@ZodSerializerDto(MessageResDTO)
	sendOTP(@Body() body: SendOTPBodyDTO) {
		return this.authService.sendOTP(body)
	}

	@Post('login')
	@IsPublic()
	@ZodSerializerDto(LoginResDTO)
	login(@Body() body: LoginBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
		return this.authService.login({
			...body,
			ip,
			userAgent,
		})
	}

	@Post('refresh-token')
	@IsPublic()
	@ZodSerializerDto(RefreshTokenResDTO)
	refreshToken(@Body() body: RefreshTokenBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
		return this.authService.refreshToken({
			refreshToken: body.refreshToken,
			ip,
			userAgent,
		})
	}

	@Post('logout')
	@ZodSerializerDto(MessageResDTO)
	logout(@Body() body: LogoutBodyDTO) {
		return this.authService.logout({ refreshToken: body.refreshToken })
	}

	@Get('google-link')
	@IsPublic()
	@ZodSerializerDto(GetAuthorizationResDTO)
	getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
		return this.googleService.getAuthorizationUrl({
			userAgent,
			ip,
		})
	}
}
