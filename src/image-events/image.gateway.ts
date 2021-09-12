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
import { ConnectionsService } from 'src/connections/connections.service'

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

  constructor(private connectionsService: ConnectionsService) {}

  @SubscribeMessage('broadcast data')
  public broadcastData(client: Socket, payload: any): void {
    client.to(payload.room).emit('receiving data', payload.data)
  }

  @SubscribeMessage('broadcast image')
  public broadcastImage(client: Socket, payload: any): void {
    this.logger.debug(
      `Broadcasting map from to ${client.id} to room ${payload.room}`,
    )
    if (client.id === payload.room) {
      this.logger.debug(`Client same as room`)
      // this.server.to(client.id).emit('receiving image', {
      //   image: payload.image,
      //   room: payload.room,
      // })
      client.to(client.id).emit('receiving image', {
        image: payload.image,
        room: client.id,
      })
    } else {
      this.logger.debug(`Client is different from room`)
      client
        .to(payload.room)
        .emit('receiving image', { image: payload.image, room: payload.room })
    }
  }

  @SubscribeMessage(SHARE_DRAW_CONFIG)
  public shareDrawConfig(client: Socket, payload: any): void {
    this.logger.debug(
      `Sharing draw config from ${client.id} to ${payload.room}`,
    )
    this.logger.debug(`Draw config ${JSON.stringify(payload.config)}`)
    client.to(payload.room).emit(SHARE_DRAW_CONFIG, payload.config)
  }

  @SubscribeMessage(BROADCAST_DRAWING)
  public broadcastDrawing(client: Socket, payload: any): void {
    this.logger.log('from', client.id, 'to', payload.room)
    this.logger.debug(`Draw config ${JSON.stringify(payload.drawConfig)}`)
    client.to(payload.room).emit(RECEIVING_DRAWING, {
      prevPos: payload.prevPos,
      currPos: payload.currPos,
      drawConfig: payload.drawConfig,
    })
  }

  @SubscribeMessage('join room')
  public joinRoom(client: Socket, room: string): void {
    this.logger.debug(`Client current rooms ${JSON.stringify(client.rooms)}`)
    this.logger.debug(`Client is in room ${client.rooms.has(room)}`)
    if (!client.rooms.has(room)) {
      this.logger.debug(`Client with id: ${client.id} joined room ${room}`)
      client.join(room)
      client.emit('joined', room)
      client.to(room).emit('user joined', client.id)
    } else {
      client.emit('already joined')
    }
  }

  @SubscribeMessage('disconnected')
  public leaveRoom(client: Socket, room: string): void {
    this.logger.log(`Disconnected client: ${client.id}`)
    this.connectionsService.delete(client.id)
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
    client.join(client.id)
    return this.logger.log(`Client connected: ${client.id}`)
  }
}
