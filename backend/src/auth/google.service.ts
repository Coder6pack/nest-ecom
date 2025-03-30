import { Injectable } from '@nestjs/common'
import { google } from 'googleapis'
import envConfig from 'src/shared/config'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class GoogleService {
	private oauth2Client: OAuth2Client
	constructor() {
		this.oauth2Client = new google.auth.OAuth2(
			envConfig.GOOGLE_OAUTH_CLIENT_ID,
			envConfig.GOOGLE_OAUTH_CLIENT_SECRET,
			envConfig.GOOGLE_OATH_REDIRECT_URI,
		)
	}
	getAuthorizationUrl({ userAgent, ip }) {
		const scope = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

		// Chuyển Object sang string chuỗi base 64 an toàn khi có dấu {}
		const stateString = Buffer.from(JSON.stringify({ userAgent, ip })).toString('base64')
		// Tạo URL để gửi về client
		const url = this.oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope,
			include_granted_scopes: true,
			state: stateString,
		})
		return { url }
	}
}
