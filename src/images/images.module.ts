import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Images } from 'src/model/Images'
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service'

@Module({
  imports: [TypeOrmModule.forFeature([Images])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
