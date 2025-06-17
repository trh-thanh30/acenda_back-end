import { Controller, Post, Body } from '@nestjs/common';
import { DifyChatService } from './dify-chat.service';
import { ChatDifyDto } from './dto/dify-chat-dto';
import { Public } from 'src/decorator/customize';

@Controller('dify-chat')
export class DifyChatController {
  constructor(private readonly difyChatService: DifyChatService) {}
  @Public()
  @Post()
  chat(@Body() question: ChatDifyDto) {
    return this.difyChatService.chat(question);
  }
}
