import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Colaborators } from 'src/model/Colaborators'
import { Users } from 'src/model/Users'
import { UsersService } from 'src/users/users.service'
import { ColaboratorsController } from './colaborators.controller'
import { ColaboratorsService } from './colaborators.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Colaborators]),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [ColaboratorsController],
  providers: [ColaboratorsService, UsersService],
})
export class ColaboratorsModule {}
