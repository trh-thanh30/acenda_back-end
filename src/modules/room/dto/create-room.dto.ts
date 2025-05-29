import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name should not exceed 100 characters' })
  @MinLength(3, { message: 'Name should be at least 3 characters long' })
  name: string;
  @IsNotEmpty({
    message: 'Hotel id is required',
  })
  hotel_id: string;
  @IsNotEmpty({
    message: 'Room quantity is required',
  })
  quantity: number;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty({
    message: 'Capacity is required',
  })
  capacity: number;
  @IsNotEmpty({
    message: 'Price is required',
  })
  price: number;
  @IsNotEmpty({
    message: 'Is Available is not empty',
  })
  isAvailable: boolean;
  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  images: string[];
  @IsNotEmpty({
    message: 'Amenities are required',
  })
  @IsArray({ message: 'Amenities must be an array' })
  amenities: string[];
}
