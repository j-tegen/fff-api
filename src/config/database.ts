import { join } from 'path'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '..', '**', '*.model.{ts,js}')],
  synchronize: true,
}
