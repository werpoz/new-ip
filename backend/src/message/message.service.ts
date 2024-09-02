import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(content: string, userId: number): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        userId,
      },
    });
  }

  async getMessages(): Promise<Message[]> {
    return this.prisma.message.findMany({
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
