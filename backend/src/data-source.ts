import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Product } from './entity/Product';

export const AppDataSource = new DataSource({
  type: 'sqljs',
  location: 'ecommerce',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Product],
  autoSave: true,
});
