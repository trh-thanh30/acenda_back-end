import { Module } from '@nestjs/common';
import { DifyChatService } from './dify-chat.service';
import { DifyChatController } from './dify-chat.controller';

@Module({
  controllers: [DifyChatController],
  providers: [DifyChatService],
})
export class DifyChatModule {}
