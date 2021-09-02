import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket } from 'socket.io'
import { Server } from 'ws'
import {
  BROADCAST_DRAWING,
  RECEIVING_DRAWING,
  SHARE_DRAW_CONFIG,
} from 'src/shared/socket-actions'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ImageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server

  private logger: Logger = new Logger('MessageGateway')

  // @SubscribeMessage('msgToServer')
  // public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
  //   return this.server.to(payload.room).emit('msgToClient', payload);
  // }

  @SubscribeMessage('broadcast data')
  public broadcastData(client: Socket, payload: any): void {
    client.to(payload.room).emit('receiving data', payload.data)
  }

  @SubscribeMessage('broadcast image')
  public broadcastImage(client: Socket, payload: any): void {
    client.join(payload.room)
    client.emit('joinedRoom', payload.room)
  }

  @SubscribeMessage(SHARE_DRAW_CONFIG)
  public shareDrawConfig(client: Socket, payload: any): void {
    client.to(payload.room).emit(SHARE_DRAW_CONFIG, payload.config)
  }

  @SubscribeMessage(BROADCAST_DRAWING)
  public broadcastDrawing(client: Socket, payload: any): void {
    this.logger.log('from', client.id, 'to', payload.room)
    client.to(payload.room).emit(RECEIVING_DRAWING, {
      prevPos: payload.prevPos,
      currPos: payload.currPos,
      drawConfig: payload.drawConfig,
    })
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    client.join(room)
    client.emit('joinedRoom', room)
  }

  @SubscribeMessage('disconnect')
  public leaveRoom(client: Socket, room: string): void {
    this.logger.log(`Disconnected client: ${client.id}`)
    client.leave(room)
    client.emit('disconnected', room)
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init')
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`)
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`)
  }
}
