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
export class ChangePasswordDto {
  @IsNotEmpty({
    message: 'code is required',
  })
  code: string;
  @IsNotEmpty({
    message: 'Id is required',
  })
  id: string;
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
  @IsNotEmpty({
    message: 'Confirm password is required',
  })
  confirmPassword: string;
}
