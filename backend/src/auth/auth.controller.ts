import { Controller, Post, Body, Res, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) { }

	@Post('/signin')
	async signIn(@Body() loginDto: LoginDto, @Res() response: Response) {
		console.log("SIGNIN")
		const result = await this.authService.signIn(loginDto.username, loginDto.password, response);
		return response.json(result);
	}

	@Post('/signup')
	async signUp(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
		console.log("SIGNUP")
		const user = await this.authService.signUpAndSignIn(createUserDto.username, createUserDto.password, response)
		return response.json(user);
	}

	@Get('/verify-token')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	verifyToken() {
		console.log("VERIFY TOKEN")
		return true;
	}
}
