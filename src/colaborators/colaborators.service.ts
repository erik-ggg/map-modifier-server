import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Colaborators } from 'src/model/Colaborators'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'

@Injectable()
export class ColaboratorsService {
  constructor(
    @InjectRepository(Colaborators)
    private colaboratorsRepository: Repository<Colaborators>,
    private userService: UsersService,
  ) {}

  async getByUserId(userId: any) {
    const user = await this.userService.findByColaboratorId(userId)
  }

  async delete(colaborator: any): Promise<Record<string, any>> {
    const col = await this.colaboratorsRepository
      .delete(colaborator)
      .catch((err) => {
        console.log('COLABORATOR DELETE ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })

    // if (col) {
    //   return col
    // }

    return { code: 200, content: { msg: 'Connection created' } }
  }

  async add(colaborator: any): Promise<Record<string, any>> {
    const col = await this.colaboratorsRepository
      .save(colaborator)
      .catch((err) => {
        console.log('COLABORATOR INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })

    if (col.code === 500) {
      return col
    }

    return { code: 201, content: { msg: 'Connection created' } }
  }
}
