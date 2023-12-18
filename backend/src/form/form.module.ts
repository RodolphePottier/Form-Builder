import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthJwtModule } from 'src/auth/jwt.module';

@Module({
	imports: [AuthJwtModule],
	controllers: [FormController],
	providers: [FormService]
})
export class FormModule { }
