import { ConflictException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) { }

	async signIn(username: string, password: string, @Res() response: Response) {

		const user = await this.userService.verifyCredentials(username, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { username: user.username, sub: user.id };
		const accessToken = this.jwtService.sign(payload);
		response.cookie('access_token', accessToken, {
			httpOnly: false,
			secure: false,
		});

		return {
			access_token: accessToken,
		};
	}

	async signUpAndSignIn(username: string, password: string, @Res() response: Response) {
		try {
			await this.userService.create(username, password);
			return this.signIn(username, password, response);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw error;
			} else {
				throw new Error('An unexpected error occurred during sign-up.');
			}
		}
	}
}