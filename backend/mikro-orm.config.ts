import { Options } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import * as dotenv from "dotenv";

dotenv.config();

const config: Options = {
	type: 'postgresql',
	host: process.env.POSTGRES_HOST || 'postgres',
	port: 5432,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	dbName: process.env.POSTGRES_DB,
	entities: ['dist/**/*.entity.js'],
	entitiesTs: ['src/**/*.entity.ts'],
	metadataProvider: TsMorphMetadataProvider,
};

export default config;