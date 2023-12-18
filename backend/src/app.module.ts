import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FormModule } from './form/form.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtModule } from './auth/jwt.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
	imports: [
		MikroOrmModule.forRoot(),
		FormModule,
		AuthModule,
		UserModule,
		AuthJwtModule
	],
	controllers: [AppController],
	providers: [AppService, JwtAuthGuard],
})
export class AppModule { }
