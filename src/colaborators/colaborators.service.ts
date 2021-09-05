import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Colaborators } from 'src/model/Colaborators'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'

@Injectable()
export class ColaboratorsService {
  constructor(
    @InjectRepository(Colaborators)
    private colaboratorsRepository: Repository<Colaborators>,
    private userService: UsersService,
    private connectionsService: ConnectionsService,
  ) {}

  async getByUserId(userId: any) {
    let resAux = []
    const colaborators = await this.userService.findByColaboratorId(userId)
    // TODO: manage errors
    colaborators.forEach(colaborator => {
      const isOnline = await this.connectionsService.query("SELECT c.user_id, c.socket_id FROM connections c WHERE c.user_id = :userId")
      if (isOnline[0].length === 0) {
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
          socketId: isOnline[0][0].socket_id,
          isOnline: true,
        })
    });
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
    const col = await this.colaboratorsRepository
      .save(colaborator)
      .catch((err) => {
        console.log('COLABORATOR INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })
      // TODO: change to inverse and return after
      // specifiy interface for colaborator
    const col = await this.colaboratorsRepository
      .save(colaborator)
      .catch((err) => {
        console.log('COLABORATOR INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })

    if (col.code === 500) {
      return col
    }

    return this.getByUserId(colaborator.user_id)
  }
}
