import { IsString, Length } from 'class-validator';

export class LoginDto {
	@IsString()
	@Length(3, 20)
	username: string;

	@IsString()
	@Length(8, 100)
	password: string;
}

export class CreateUserDto {
	@IsString()
	@Length(3, 20)
	username: string;

	@IsString()
	@Length(8, 100)
	password: string;
}
