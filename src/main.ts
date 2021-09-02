import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import 'reflect-metadata'
// import { RedisIoAdapter } from './adapters/redis.adapter';
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
    },
  })
  await app.listen(process.env.APP_PORT)
}
bootstrap()
