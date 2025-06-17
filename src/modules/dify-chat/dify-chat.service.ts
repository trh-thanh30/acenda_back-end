import { Injectable } from '@nestjs/common';
import { ChatDifyDto } from './dto/dify-chat-dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DifyChatService {
  constructor(private readonly configService: ConfigService) {}
  async chat(question: ChatDifyDto) {
    try {
      const response = await axios.post(
        `${this.configService.get<string>('DIFY_BASE_URL')}/chat-messages`,
        {
          inputs: {},
          query: question,
          response_mode: 'blocking',
          conversation_id: '',
          user: 'user-123',
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('DIFY_API_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const answer = response.data?.answer || response.data?.output;

      return { answer };
    } catch (error) {
      console.error('Dify API Error:', error.response?.data || error.message);
    }
  }
}
