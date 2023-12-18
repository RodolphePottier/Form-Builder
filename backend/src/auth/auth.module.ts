import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService, JwtAuthGuard],
	imports: [
		JwtModule.register({
			secret: 'SECRET_KEY',
			signOptions: { expiresIn: '3600s' },
		}),
	],
})
export class AuthModule { }
