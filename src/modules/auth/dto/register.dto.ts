import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { userGender } from 'src/modules/users/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty({
    message: 'First name is required',
  })
  @IsString()
  first_name: string;

  @IsNotEmpty({
    message: 'Last name is required',
  })
  @IsString()
  last_name: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsString()
  @IsEmail(
    {},
    {
      message: 'Email is not valid',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsString()
  password: string;

  @IsNotEmpty({
    message: 'Gender is required',
  })
  @IsNotEmpty()
  @IsEnum(userGender, {
    message: 'Gender must be one of: male, female, other',
  })
  gender: userGender;

  @IsNotEmpty({
    message: 'Date of birth is required',
  })
  @IsString()
  @IsDateString()
  date_of_birth: string;
}
