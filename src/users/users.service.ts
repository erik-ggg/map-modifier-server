import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connections } from 'src/model/Connections'
import { Users } from 'src/model/Users'
import { Repository } from 'typeorm/repository/Repository'

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService')

  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Users)
    private connectionsRepository: Repository<Connections>,
  ) {}

  async add(user: any): Promise<Record<string, any>> {
    const existUser = await this.userRepository.find({
      where: { email: user.email },
    })
    const newConnection = {
      user_id: user.email,
      socket_id: user.socketId,
    }
    if (existUser) {
      const con = await this.connectionsRepository
        .save(newConnection)
        .catch((err) => {
          console.log('CONNECTION INSERT ERROR', err)
          return { code: 500, content: { msg: 'Internal server error' } }
        })

      if (con) {
        console.log('CREATED CONNECTION')
        return { code: 201, content: { msg: 'Connection created' } }
      }
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
        const con = await this.connectionsRepository
          .save(newConnection)
          .catch((err) => {
            console.log('USER INSERT ERROR', err)
            return { code: 500, content: { msg: 'Internal server error' } }
          })

        if (con) {
          console.log('CREATED CONNECTION')
          return { code: 201, content: { msg: 'Connection created' } }
        }
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
