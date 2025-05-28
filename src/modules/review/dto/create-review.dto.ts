import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({
    message: 'Rating is required',
  })
  rating: number;
  @IsNotEmpty({
    message: 'Comment is required',
  })
  comment: string;
  @IsNotEmpty({
    message: 'Title is required',
  })
  title: string;
  @IsNotEmpty({
    message: 'Hotel id is required',
  })
  hotel_id: string;
}
