import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/reskue.entity';
import { UserService } from './user.service';

@Module({
	imports: [MikroOrmModule.forFeature([User])],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule { }
