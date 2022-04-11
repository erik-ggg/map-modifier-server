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

  async delete(id: string): Promise<Record<string, any>> {
    this.logger.debug(`Deleting connection for user ${id}`)
    let result = null
    this.connectionsRepository.delete({ user_id: id }).catch((err) => {
      this.logger.error('CONNECTION DELETE ERROR', err)
      result = { code: 500, content: { message: 'Internal server error' } }
    })
    return result || { code: 200, content: { message: 'Connection deleted' } }
  }

  async findByUserId(userId) {
    this.logger.debug('Finding connection for user', userId)
    let result = null
    const con = await this.connectionsRepository
      .findOne({
        where: { user_id: userId },
      })
      .catch((err) => {
        this.logger.error('CONNECTION INSERT ERROR', err)
        result = { code: 500, content: { message: 'Internal server error' } }
      })
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
    let result = null
    const con = await this.connectionsRepository
      .save(connection)
      .catch((err) => {
        this.logger.error('CONNECTION INSERT ERROR', err)
        result = { code: 500, content: { message: 'Internal server error' } }
      })

    return result || { code: 201, content: { con } }
  }
}
