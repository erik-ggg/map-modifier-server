import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Users } from 'src/model/Users'
import { Repository } from 'typeorm/repository/Repository'

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService')

  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private connectionsService: ConnectionsService,
  ) {}

  async findByColaboratorId(userId: any) {
    return await this.userRepository.query(
      'SELECT u.email, u.name FROM users u, colaborators col WHERE u.email = col.colaborator_id AND col.user_id = :userId',
    )
  }

  async add(user: any): Promise<Record<string, any>> {
    const existUser = await this.userRepository.find({
      where: { email: user.email },
    })
    const newConnection = {
      user_id: user.email,
      socket_id: user.socketId,
    }
    if (existUser) {
      return this.connectionsService.add(newConnection)
      // else {
      //   console.log('CONNECTION INSERT ERROR')
      //   return { code: 500, content: { msg: 'Internal server error' } }
      // }
    } else {
      const userCreated = await this.userRepository.save(user).catch((err) => {
        console.log('USER INSERT ERROR', err)
        return { code: 500, content: { msg: 'Internal server error' } }
      })

      if (userCreated) {
        console.log('CREATED USER')
        return this.connectionsService.add(newConnection)
        // else {
        //   console.log('CONNECTION INSERT ERROR')
        //   return { code: 500, content: { msg: 'Internal server error' } }
        // }
      }
      // else {
      //   console.log('USER INSERT ERROR')
      //   return { code: 500, content: { msg: 'Internal server error' } }
      // }
    }
    return { code: 500, content: { msg: 'Internal server error' } }
  }
}
