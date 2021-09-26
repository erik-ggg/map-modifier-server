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
import { ImageInput } from 'src/interface/ImageInput'
import { ImagesService } from './images.service'

@Controller('api/images')
export class ImagesController {
  private logger: Logger = new Logger('ImagesController')

  constructor(private imagesService: ImagesService) {}

  @Post()
  async save(@Body() body: ImageInput, @Res() res) {
    this.logger.log(`Save image request for user ${body.userId}`)
    const result = await this.imagesService.save(body)
    res.status(result.code).json(result.content)
  }

  @Get(':userId')
  async getAll(@Param() params) {
    // return await this.colaboratorsService.getByUserId(params.userId)
  }

  @Delete()
  async delete(@Body() body, @Res() res) {
    // const colaborator = {
    //   source: body.source,
    //   target: body.target,
    // }
    // const result = await this.colaboratorsService.delete(colaborator)
    // res.status(result.code).json(result.content)
  }
}
