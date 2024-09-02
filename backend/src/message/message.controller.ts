import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';

@ApiTags('messages') // Tag for Swagger
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'List all messages' })
  @ApiResponse({
    status: 200,
    description: 'List of all messages',
    type: [MessageDto],
  })
  async getMessages(): Promise<MessageDto[]> {
    const messages = await this.messageService.getMessages();
    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      userId: message.userId,
      createdAt: message.createdAt,
      user: message['user'].email,
    }));
  }
}
