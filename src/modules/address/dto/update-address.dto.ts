import { IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  province?: string;
  @IsOptional()
  district?: string;
  @IsOptional()
  commune?: string;
  @IsOptional()
  detail_address?: string;
}
