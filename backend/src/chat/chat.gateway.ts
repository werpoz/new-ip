import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messageService: MessageService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      client.data.user = user; // Almacenar el usuario en la conexión del cliente
      console.log(`Client connected: ${client.id}, user: ${user.email}`);
    } catch (e) {
      console.error('Unauthorized:', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { content: string },
  ) {
    const user = client.data.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const message = await this.messageService.createMessage(
      payload.content,
      user.id,
    );
    this.server.emit('message', {
      ...message,
      user: { id: user.id, email: user.email },
    });
  }
}
