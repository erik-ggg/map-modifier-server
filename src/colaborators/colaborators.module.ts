import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Colaborators } from 'src/model/Colaborators'
import { ColaboratorsController } from './colaborators.controller'
import { ColaboratorsService } from './colaborators.service'

@Module({
  imports: [TypeOrmModule.forFeature([Colaborators])],
  controllers: [ColaboratorsController],
  providers: [ColaboratorsService],
})
export class ColaboratorsModule {}
