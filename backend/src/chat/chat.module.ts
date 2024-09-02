import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MessageService } from 'src/message/message.service';

@Module({
  providers: [
    ChatGateway,
    MessageService,
    UserService,
    JwtService,
    PrismaService,
  ],
})
export class ChatModule {}
