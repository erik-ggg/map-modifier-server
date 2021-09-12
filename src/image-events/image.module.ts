import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Connections } from 'src/model/Connections'
import { ImageGateway } from './image.gateway'

@Module({
  imports: [TypeOrmModule.forFeature([Connections])],
  controllers: [],
  providers: [ImageGateway, ConnectionsService],
})
export class ImageModule {}
