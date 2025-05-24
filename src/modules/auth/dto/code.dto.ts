import { IsNotEmpty } from 'class-validator';

export class CodeDto {
  @IsNotEmpty({
    message: 'Id is required',
  })
  id: string;
  @IsNotEmpty({
    message: 'Code is required',
  })
  code: string;
}
