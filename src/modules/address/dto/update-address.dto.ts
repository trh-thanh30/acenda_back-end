import { IsOptional } from 'class-validator';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';

export class UpdateAddressDto {
  @IsOptional()
  province?: string;
  @IsOptional()
  district?: string;
  @IsOptional()
  commune?: string;
  @IsOptional()
  detail_address?: string;
  @IsOptional()
  hotel: Hotel;
}
