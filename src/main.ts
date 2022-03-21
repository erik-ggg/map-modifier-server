import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import 'reflect-metadata'
import { NestExpressApplication } from '@nestjs/platform-express'
import { urlencoded, json } from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
    },
  })
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  await app.listen(process.env.APP_PORT)
}
bootstrap()
