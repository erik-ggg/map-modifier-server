import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { ColaboratorsModule } from './colaborators/colaborators.module'
import { ConnectionsModule } from './connections/connections.module'
import { ImageModule } from './image-events/image.module'
import { ImagesModule } from './images/images.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    ColaboratorsModule,
    ConnectionsModule,
    ImageModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
