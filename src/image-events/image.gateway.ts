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
  BROADCAST_IMAGE,
  END_DRAWING,
  RECEIVING_DRAWING,
  RECEIVING_IMAGE,
  SHARE_DRAW_CONFIG,
  START_DRAWING,
} from 'src/shared/socket-actions'
import { ConnectionsService } from 'src/connections/connections.service'
import { throws } from 'assert'
import e from 'cors'

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

  @SubscribeMessage(BROADCAST_IMAGE)
  public broadcastImage(client: Socket, payload: any): void {
    this.logger.debug(
      `Broadcasting map from to ${client.id} to room ${payload.room}`,
    )
    if (client.id === payload.room) {
      this.server
        .to(payload.room)
        .emit(RECEIVING_IMAGE, { image: payload.image, room: payload.room })
    } else {
      client
        .to(payload.room)
        .emit(RECEIVING_IMAGE, { image: payload.image, room: client.id })
    }
  }

  @SubscribeMessage(SHARE_DRAW_CONFIG)
  public shareDrawConfig(client: Socket, payload: any): void {
    // this.logger.debug(
    //   `Sharing draw config from ${client.id} to ${payload.room}`,
    // )
    // this.logger.debug(`Draw config ${JSON.stringify(payload.config)}`)
    client.to(payload.room).emit(SHARE_DRAW_CONFIG, payload.config)
  }

  @SubscribeMessage(BROADCAST_DRAWING)
  public broadcastDrawing(client: Socket, payload: any): void {
    this.logger.debug(`From ${client.id} to ${payload.room}`)
    this.server.to(payload.room).emit(RECEIVING_DRAWING, {
      prevPos: payload.prevPos,
      currPos: payload.currPos,
      drawConfig: payload.drawConfig,
      room: client.id,
    })
  }

  @SubscribeMessage('join room')
  public joinRoom(client: Socket, room: string): void {
    // this.logger.debug(
    //   `Host joined clients ${JSON.stringify(
    //     this.server.sockets.manager.roomClients[room],
    //   )}`,
    // )
    this.logger.debug(`Client current rooms ${[...client.rooms]}`)
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

  @SubscribeMessage(START_DRAWING)
  public startDrawing(client: Socket, payload: any): void {
    this.logger.log(`Client: ${client.id} started drawing`)
    this.server
      .to(payload.room)
      .emit(START_DRAWING, payload.drawConfig, client.id)
  }

  @SubscribeMessage(END_DRAWING)
  public endDrawing(client: Socket, payload: any): void {
    this.logger.log(`Client: ${client.id} ended drawing`)
    this.server.to(payload.room).emit(END_DRAWING, client.id)
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
    this.connectionsService.delete(client.id)
    return this.logger.log(`Client disconnected: ${client.id}`)
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`)
  }
}
