import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connections } from 'src/model/Connections'
import { Repository } from 'typeorm'

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connections)
    private connectionsRepository: Repository<Connections>,
  ) {}

  async add(connection: any): Promise<Record<string, any>> {
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
