import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import { ColaboratorsService } from './colaborators.service'

@Controller('api/colaborators')
export class ColaboratorsController {
  private logger: Logger = new Logger('ColaboratorsController')

  constructor(private colaboratorsService: ColaboratorsService) {}

  @Post()
  async create(@Body() body, @Res() res) {
    const colaborator = {
      user_id: body.source,
      colaborator_id: body.target,
    }
    this.logger.log(`Adding colaborator ${colaborator}`)
    const result = await this.colaboratorsService.add(colaborator)
    this.logger.debug(result)
    res.status(result.code).json(result.content)
  }

  @Get(':userId')
  async getAll(@Param() params) {
    return await this.colaboratorsService.getByUserId(params.userId)
  }

  @Delete()
  async delete(@Body() body, @Res() res) {
    const colaborator = {
      source: body.source,
      target: body.target,
    }
    const result = await this.colaboratorsService.delete(colaborator)
    res.status(result.code).json(result.content)
  }
}
