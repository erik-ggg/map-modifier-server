import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Connections } from 'src/model/Connections'
import { Users } from 'src/model/Users'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Connections]),
  ],
  providers: [UsersService, ConnectionsService],
  controllers: [UsersController],
})
export class UsersModule {}
