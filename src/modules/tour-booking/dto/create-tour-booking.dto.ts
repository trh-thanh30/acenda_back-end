import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTourBookingDto {
  @IsNotEmpty({
    message: 'Tour id is required',
  })
  tour_id: string;

  @IsNotEmpty({
    message: 'Start date is required',
  })
  startDate: Date;

  @IsNotEmpty({
    message: 'Quantity adult is required',
  })
  quantityAdult: number;

  @IsNotEmpty({
    message: 'Quantity child is required',
  })
  quantityChild: number;

  @IsOptional()
  endDate: Date;
}
