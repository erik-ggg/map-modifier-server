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
  ) {}

  async getByUserEmail(email: string) {
    this.logger.debug(`Finding user by email ${email}`)
    let result = null
    const user = await this.userRepository
      .findOne({ where: { email: email } })
      .catch((err) => {
        this.logger.error(`USER FIND ERROR ${err}`)
        result = { code: 500, content: { message: 'Internal server error' } }
      })
    return result || { code: 200, content: { user } }
  }

  async findByColaboratorId(userId: any) {
    this.logger.debug('Finding colaborators for user', userId)
    const colaborators = await this.userRepository.query(
      'SELECT u.email, u.name FROM users u, colaborators col WHERE u.email = col.colaborator_id AND col.user_id = ?',
      [userId],
    )
    this.logger.debug('Colaborators for found', colaborators)
    return colaborators
  }

  async add(user: any): Promise<Record<string, any>> {
    this.logger.debug(`Saving new user ${user.name} ${user.email}`)
    let result = null
    const userCreated = await this.userRepository.save(user).catch((err) => {
      this.logger.error(`USER INSERT ERROR ${err}`)
      result = { code: 500, content: { msg: 'Internal server error' } }
    })
    delete userCreated.id
    return result || userCreated
  }

  async updateUserSocketId(email: any, socketId: any) {
    //   this.logger.log('Updating user socketid by email', email)
    //   const user = await this.userRepository.query(
    //     ``
    //   )
    //   if (user) {
    //     this.logger.log('Found user', user)
    //     return { code: 200, content: { user } }
    //   } else {
    //     this.logger.log('Error founding user', user)
    //     return { code: 500, content: { msg: 'Internal server error' } }
    //   }
  }
}
