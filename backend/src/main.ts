import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';
import { HttpExceptionFilter } from './common/filter/httpException.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	});

	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		transform: true
	}));

	const logger = new Logger('bootstrap');

	const orm = await MikroORM.init(mikroOrmConfig);

	try {
		app.use(cookieParser());
		await app.listen(process.env.API_PORT);

		logger.log('Application started successfully');

	} catch (err) {
		logger.error(`Error during application startup: ${err}`);
	} finally {
		await orm.close();
	}
}

bootstrap();
