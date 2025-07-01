import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty({
    message: 'Title is required',
  })
  @MaxLength(100, { message: 'Title should not exceed 100 characters' })
  @MinLength(3, { message: 'Title should be at least 3 characters long' })
  title: string;
  @IsNotEmpty({
    message: 'Content is required',
  })
  content: string;
  @IsOptional({
    message: 'Thumbnail is required',
  })
  thumbnail: string;
}
