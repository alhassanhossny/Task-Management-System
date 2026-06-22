import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'task_admin',
  password: process.env.DB_PASSWORD || 'Task@Secure#2024',
  database: process.env.DB_DATABASE || 'task_hospital',
  entities: [__dirname + '/../../domain/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
