import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageInput } from 'src/interface/ImageInput'
import { Images } from 'src/model/Images'
import { Repository } from 'typeorm'

@Injectable()
export class ImagesService {
  private logger: Logger = new Logger('ImagesService')

  constructor(
    @InjectRepository(Images)
    private colaboratorsRepository: Repository<Images>,
  ) {}

  async save(body: ImageInput): Promise<Record<string, any>> {
    const imageData = {
      user_id: body.userId,
      image_name: body.imageName,
      image_location: 'test',
      canvas_data: body.canvasData,
    }
    this.logger.log('Saving image from user', body.userId)
    const res = await this.colaboratorsRepository
      .save(imageData)
      .catch((err) => {
        console.log('COLABORATOR INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })
    this.logger.log(`Image from user ${body.userId} saved`)
    if (!res['code']) return { code: 201, content: null }
  }
}
