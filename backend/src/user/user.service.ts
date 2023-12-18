import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/reskue.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(private readonly em: EntityManager) { }

	async create(username: string, password: string): Promise<User> {
		const existingUser = await this.em.findOne(User, { username });
		if (existingUser) {
			throw new ConflictException('Username already taken');
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User();
		user.username = username;
		user.password = hashedPassword;

		await this.em.persistAndFlush(user);
		return user;
	}

	async verifyCredentials(username: string, password: string): Promise<User | null> {
		const user = await this.em.findOne(User, { username });
		if (user && await bcrypt.compare(password, user.password)) {
			return user;
		}
		return null;
	}

}
