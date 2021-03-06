import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connections } from 'src/model/Connections'
import { Repository } from 'typeorm'

@Injectable()
export class ConnectionsService {
  private logger: Logger = new Logger('ConnectionsService')

  constructor(
    @InjectRepository(Connections)
    private connectionsRepository: Repository<Connections>,
  ) {}

  async delete(id: string) {
    this.logger.debug('Deleting connection with id', id)
    this.connectionsRepository.delete({ socket_id: id })
  }

  async findByUserId(userId) {
    this.logger.debug('Finding connection for user', userId)
    const con = await this.connectionsRepository
      .findOne({
        where: { user_id: userId },
      })
      .catch((err) => {
        this.logger.error('CONNECTION INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })
    // if (con.code === 500)
    //   return { code: 201, content: { msg: 'Connection created' } }
    return con
  }

  async add(connection: any): Promise<Record<string, any>> {
    const existCon = await this.connectionsRepository.find({
      where: { user_id: connection.user_id },
    })
    if (existCon.length > 0) {
      await this.connectionsRepository.delete({
        user_id: connection.user_id,
      })
    }
    const con = await this.connectionsRepository
      .save(connection)
      .catch((err) => {
        console.log('CONNECTION INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })

    console.log(con)
    if (con.code === 500) {
      console.log('CREATED CONNECTION', con)
      return { con }
    } else {
      return { code: 201, content: { msg: 'Connection created' } }
    }
  }
}
