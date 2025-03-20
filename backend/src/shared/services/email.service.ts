import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from '../config'

@Injectable()
export class EmailService {
	private resend: Resend
	constructor() {
		this.resend = new Resend(envConfig.RESEND_OTP_API_KEY_SECRET)
	}

	async sendOTP(payload: { email: string; code: string }) {
		return this.resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to: [payload.email],
			subject: 'OTP',
			html: `<strong>${payload.code}</strong>`,
		})
	}
}
