import { Body, Controller, Logger, Post, Res } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  private logger: Logger = new Logger('UsersController')

  @Post()
  async create(@Body() body, @Res() res) {
    const user = {
      name: body.name,
      email: body.email,
    }
    const result = await this.userService.add(user)
    res.status(result.code).json(result.content)
  }
}
