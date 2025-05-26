import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/create-address.dto';

export class CreateHotelDto {
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name should not exceed 100 characters' })
  @MinLength(3, { message: 'Name should be at least 3 characters long' })
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  address: CreateAddressDto;
  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  images?: string[];
  @IsOptional()
  @IsArray({ message: 'Amenities must be an array' })
  amenities?: string[];
}
