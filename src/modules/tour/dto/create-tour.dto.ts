import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTourDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @MaxLength(100, { message: 'Name should not exceed 100 characters' })
  @MinLength(3, { message: 'Name should be at least 3 characters long' })
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty({
    message: 'Highlights is required',
  })
  @IsArray({ message: 'Highlights must be an array' })
  highlights: string[];

  @IsNotEmpty({
    message: 'Plan details is required',
  })
  planDetails: string;

  @IsNotEmpty({
    message: 'Address is required',
  })
  address: string;

  @IsNotEmpty({
    message: 'Itinerary is required',
  })
  itinerary: string;

  @IsNotEmpty({
    message: 'Duration is required',
  })
  durationDays: number;

  @IsNotEmpty({
    message: 'Price Adult is required',
  })
  priceAdult: number;

  @IsNotEmpty({
    message: 'Price Child is required',
  })
  priceChild: number;

  @IsNotEmpty({
    message: 'Travel cost details is required',
  })
  travelCostDetails: string;

  @IsOptional()
  availableSlots: number;

  @IsOptional()
  departure_schedule: string;
  @IsOptional()
  surcharge: string;
  @IsOptional()
  note: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  images: string[];
}
