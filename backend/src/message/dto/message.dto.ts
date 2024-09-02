import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;
}

export class MessageDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the message',
  })
  id: number;

  @ApiProperty({
    example: 'Hello, world!',
    description: 'The content of the message',
  })
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who sent the message',
  })
  userId: number;

  @ApiProperty({
    example: '2024-09-01T00:00:00.000Z',
    description: 'The creation date of the message',
  })
  createdAt: Date;

  @ApiProperty({ type: UserDto, description: 'The user who sent the message' })
  user: UserDto;
}
