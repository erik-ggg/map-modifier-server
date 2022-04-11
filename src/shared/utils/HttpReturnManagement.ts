import { HttpStatus } from '@nestjs/common'

export function httpReturnManagement(result: any, res: any) {
  if (result.code === 500) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result.content)
  } else {
    res.status(HttpStatus.OK).send(result.content)
  }
}
