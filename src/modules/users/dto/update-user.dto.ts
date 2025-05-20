import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Email is not valid',
    },
  )
  email: string;
  @IsOptional()
  first_name: string;
  @IsOptional()
  last_name: string;
  @IsOptional()
  phone_number: string;
  @IsOptional()
  address: string;
  @IsOptional()
  avatar: string;
}
