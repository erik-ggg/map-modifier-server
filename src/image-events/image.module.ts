import { Module } from '@nestjs/common';
import { ImageGateway } from './image.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ImageGateway],
})
export class ImageModule {}
