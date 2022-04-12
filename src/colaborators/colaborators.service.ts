import { HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConnectionsService } from 'src/connections/connections.service'
import { Colaborators } from 'src/model/Colaborators'
import { Connections } from 'src/model/Connections'
import { HttpResponse } from 'src/types'
import { UsersService } from 'src/users/users.service'
import { getManager, Repository } from 'typeorm'
import { ColaboratorInput } from './types'

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

  async delete(input: ColaboratorInput): Promise<HttpResponse> {
    let result = null
    const validation = await this.validateInputDelete(input)
    if (validation.code !== HttpStatus.OK) {
      return validation
    }
    await getManager().transaction(async (transactionalEntityManager) => {
      const colaboratorEntity = new Colaborators(
        input.user_id,
        input.colaborator_id,
      )
      await transactionalEntityManager
        .delete(Colaborators, colaboratorEntity)
        .catch((err) => {
          this.logger.error(err)
          result = {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            content: {
              message: 'Error deleting colaborator',
            },
          }
        })
      const reversedColaboratorEntity = new Colaborators(
        input.colaborator_id,
        input.user_id,
      )
      await transactionalEntityManager
        .delete(Colaborators, reversedColaboratorEntity)
        .catch((err) => {
          this.logger.error(err)
          result = {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            content: {
              message: 'Error deleting colaborator',
            },
          }
        })
    })
    return (
      result || {
        code: HttpStatus.OK,
        content: { message: 'Colaborator successfully deleted' },
      }
    )
  }

  async add(input: ColaboratorInput): Promise<Record<string, any>> {
    let result = null
    const validation = await this.validateInputAdd(input)
    if (validation.code !== HttpStatus.OK) {
      return validation
    }
    await getManager().transaction(async (transactionalEntityManager) => {
      this.logger.debug('Adding colaborator', input)
      const colaboratorEntity = new Colaborators(
        input.user_id,
        input.colaborator_id,
      )
      await transactionalEntityManager.save(colaboratorEntity).catch((err) => {
        this.logger.error('COLABORATOR INSERT ERROR', err)
        result = {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          content: { message: 'Internal server error' },
        }
      })
      const reversedColaboratorEntity = new Colaborators(
        input.colaborator_id,
        input.user_id,
      )
      await transactionalEntityManager
        .save(reversedColaboratorEntity)
        .catch((err) => {
          this.logger.error('COLABORATOR INSERT ERROR', err)
          result = {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Internal server error' },
          }
        })
    })

    return (
      result || {
        code: HttpStatus.OK,
        content: { message: 'Colaborator added' },
      }
    )
  }

  /**
   * Validates if both users exists before trying to remove the connection
   * @param input
   * @returns
   */
  private async validateInputDelete(
    input: ColaboratorInput,
  ): Promise<HttpResponse> {
    const targetUser = await this.userService.getByUserEmail(
      input.colaborator_id,
    )
    if (
      targetUser.code === HttpStatus.INTERNAL_SERVER_ERROR ||
      targetUser.content.user === undefined
    ) {
      return {
        code: 404,
        content: { message: 'Colaborator not found' },
      }
    }
    const sourceUser = await this.userService.getByUserEmail(input.user_id)
    if (
      sourceUser.code === HttpStatus.INTERNAL_SERVER_ERROR ||
      targetUser.content.user === undefined
    ) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        content: { message: 'Internal server error' },
      }
    }
    return { code: HttpStatus.OK, content: {} }
  }

  /**
   * Checks if the colaborator source and target exists in database.
   * Also checks if they are already added as a colaborator.
   * @param input the colaborator to validate
   * @returns
   */
  private async validateInputAdd(
    input: ColaboratorInput,
  ): Promise<HttpResponse> {
    const targetUser = await this.userService.getByUserEmail(
      input.colaborator_id,
    )
    if (
      targetUser.code === HttpStatus.INTERNAL_SERVER_ERROR ||
      targetUser.content.user === undefined
    ) {
      return {
        code: 404,
        content: { message: 'Colaborator not found' },
      }
    }
    const sourceUser = await this.userService.getByUserEmail(input.user_id)
    if (
      sourceUser.code === HttpStatus.INTERNAL_SERVER_ERROR ||
      targetUser.content.user === undefined
    ) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        content: { message: 'Internal server error' },
      }
    }
    const exists = await this.colaboratorsRepository.findOne({
      where: { user_id: input.user_id, colaborator_id: input.colaborator_id },
    })
    if (exists) {
      return {
        code: HttpStatus.BAD_REQUEST,
        content: { message: 'Colaborator already exists' },
      }
    }
    return { code: HttpStatus.OK, content: {} }
  }
}
