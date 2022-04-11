import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import {
  httpReturnManagementGet,
  httpReturnManagementPost,
} from 'src/shared/utils/HttpReturnManagement'
import { ConnectionsService } from './connections.service'

@Controller('api/connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  private logger: Logger = new Logger('ConnectionsController')

  @Post()
  async create(@Body() body, @Res() res) {
    this.logger.debug(
      `New connection POST request: ${body.user_id} ${body.socket_id}`,
    )
    const connection = {
      user_id: body.user_id,
      socket_id: body.socket_id,
    }
    const result = await this.connectionsService.add(connection)
    httpReturnManagementPost(result, res)
  }

  @Delete(':email')
  async delete(@Param('email') email, @Res() res) {
    this.logger.debug(`New connection DELETE request: ${email}`)
    const result = await this.connectionsService.delete(email)
    httpReturnManagementGet(result, res)
  }
}
