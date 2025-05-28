import { IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  capacity?: number;
  @IsOptional()
  price?: number;
  @IsOptional()
  isAvailable?: boolean;
  @IsOptional()
  amenities?: string[];
  @IsOptional()
  images?: string[];
}
