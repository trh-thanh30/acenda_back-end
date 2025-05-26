import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'Province is required' })
  province: string;
  @IsNotEmpty({ message: 'District is required' })
  district: string;
  @IsNotEmpty({ message: 'Commune is required' })
  commune: string;
  @IsNotEmpty({ message: 'Detail address is required' })
  detail_address: string;
}
