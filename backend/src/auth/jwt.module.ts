import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [
		JwtModule.register({
			secret: 'SECRET_KEY',
			signOptions: { expiresIn: '3600s' },
		}),
	],
	providers: [AuthService, UserService],
	exports: [JwtModule],
})
export class AuthJwtModule { }