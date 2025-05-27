import { IsOptional } from 'class-validator';
import { UpdateAddressDto } from 'src/modules/address/dto/update-address.dto';

export class UpdateHotelDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  amenities?: string[];
  @IsOptional()
  address?: UpdateAddressDto;
  @IsOptional()
  images?: string[];
}
