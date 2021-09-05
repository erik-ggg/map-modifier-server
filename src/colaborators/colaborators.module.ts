import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Colaborators } from 'src/model/Colaborators'
import { Connections } from 'src/model/Connections'
import { Users } from 'src/model/Users'
import { UsersService } from 'src/users/users.service'
import { ColaboratorsController } from './colaborators.controller'
import { ColaboratorsService } from './colaborators.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Colaborators]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Connections]),
  ],
  controllers: [ColaboratorsController],
  providers: [ColaboratorsService, UsersService, ConnectionsService],
})
export class ColaboratorsModule {}
