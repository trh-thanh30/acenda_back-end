import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDifyDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
