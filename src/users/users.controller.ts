import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common'
import { httpReturnManagement } from 'src/shared/utils/HttpReturnManagement'
import { UsersService } from './users.service'

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  private logger: Logger = new Logger('UsersController')

  @Get(':email')
  async getUserByEmail(@Param('email') email: string, @Res() res) {
    this.logger.debug(`User GET request: ${email}`)
    const result = await this.userService.getByUserEmail(email)
    httpReturnManagement(result, res)
  }

  @Post()
  async create(@Body() body, @Res() res) {
    this.logger.debug(`New user POST request: ${body.name} ${body.email}`)
    const user = {
      name: body.name,
      email: body.email,
    }
    const result = await this.userService.add(user)
    if (result.code === 500) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(user)
    } else {
      res.status(HttpStatus.CREATED).send(user)
    }
    // res.status(result.code).json(result.content)
  }

  @Patch()
  async updateUserSocketId(@Body() body, @Res() res) {
    // this.logger.debug(`New user PATCH request: ${body}`)
    // const result = await this.userService.updateUserSocketId(
    //   body.email,
    //   body.socketId,
    // )
    // res.status(result.code).json(result.content)
  }
}
