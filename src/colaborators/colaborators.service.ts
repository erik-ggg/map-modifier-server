import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Colaborators } from 'src/model/Colaborators'
import { Connections } from 'src/model/Connections'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'

@Injectable()
export class ColaboratorsService {
  private logger: Logger = new Logger('ColaboratorsService')

  constructor(
    @InjectRepository(Colaborators)
    private colaboratorsRepository: Repository<Colaborators>,
    private userService: UsersService,
    private connectionsService: ConnectionsService,
  ) {}

  async getByUserId(userId: any) {
    const resAux = []
    const colaborators = await this.userService.findByColaboratorId(userId)
    // TODO: manage errors
    this.logger.debug('All colaborators found', JSON.stringify(colaborators))
    for await (const colaborator of colaborators) {
      const isOnline = await this.connectionsService.findByUserId(
        colaborator.email,
      )
      this.logger.debug(
        'Checking if colaborators in online',
        JSON.stringify(isOnline),
      )
      if (!(isOnline instanceof Connections)) {
        resAux.push({
          name: colaborator.name,
          email: colaborator.email,
          socketId: null,
          isOnline: false,
        })
      } else
        resAux.push({
          name: colaborator.name,
          email: colaborator.email,
          socketId: isOnline.socket_id,
          isOnline: true,
        })
    }
    return resAux
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
    // TODO: enable transaction
    // mirar que no esta añadido ya
    this.logger.log('Adding colaborator', colaborator)
    const col = await this.colaboratorsRepository
      .save(colaborator)
      .catch((err) => {
        console.log('COLABORATOR INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })
    // TODO: change to inverse and return after
    // specifiy interface for colaborator
    const invCol: any = {
      user_id: colaborator.colaborator_id,
      colaborator_id: colaborator.user_id,
    }
    const col2 = await this.colaboratorsRepository.save(invCol).catch((err) => {
      console.log('COLABORATOR INSERT ERROR', err)
      return { code: 500, content: { msg: 'Internal server error' } }
    })

    if (col.code === 500 || col2.code === 500) {
      return col
    }

    return await this.getByUserId(colaborator.source)
  }
}
