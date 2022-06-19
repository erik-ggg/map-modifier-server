import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket } from 'socket.io'
import { Server } from 'ws'
import {
  BROADCAST_DRAWING,
  BROADCAST_FIGURE,
  BROADCAST_IMAGE,
  CONNECTED,
  DISCONNECT,
  DISCONNECTED,
  END_DRAWING,
  RECEIVING_DRAWING,
  RECEIVING_IMAGE,
  SEND_IMAGE_AND_CANVAS_TO_CLIENT,
  SHARE_DRAW_CONFIG,
  START_DRAWING,
} from 'src/shared/socket-actions'
import { ConnectionsService } from 'src/connections/connections.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e9,
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

  @SubscribeMessage(BROADCAST_FIGURE)
  public broadcastFigure(client: Socket, payload: any): void {
    this.logger.debug(`From ${client.id} to ${payload.room}`)
    this.server.to(payload.room).emit(BROADCAST_FIGURE, {
      prevPosOffsetX: payload.prevPosOffsetX,
      prevPosOffsetY: payload.prevPosOffsetY,
      offsetX: payload.offsetX,
      offsetY: payload.offsetY,
      room: client.id,
      drawingFigure: payload.drawingFigure,
    })
  }

  @SubscribeMessage(SEND_IMAGE_AND_CANVAS_TO_CLIENT)
  public sendImageFromHostToGuest(client: Socket, payload: any): void {
    this.logger.debug(
      `Sending image from host ${client.id} to guest ${payload.clientId}`,
    )
    if (client.id !== payload.clientId) {
      this.server.to(payload.clientId).emit(SEND_IMAGE_AND_CANVAS_TO_CLIENT, {
        image: payload.image,
        canvas: payload.canvas,
        userTarget: payload.clientId,
      })
    }
  }

  @SubscribeMessage(SHARE_DRAW_CONFIG)
  public shareDrawConfig(client: Socket, payload: any): void {
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

  @SubscribeMessage(DISCONNECT)
  public leaveRoom(client: Socket, room: string): void {
    this.logger.log(`Disconnected client: ${client.id}`)
    this.connectionsService.delete(client.id)
    client.leave(room)
    client.emit(DISCONNECTED, room)
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init')
  }

  public handleDisconnect(client: Socket): void {
    this.connectionsService.delete(client.id)
    return this.logger.log(`Client disconnected: ${client.id}`)
  }

  public handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`)
    client.emit(CONNECTED)
  }
}
