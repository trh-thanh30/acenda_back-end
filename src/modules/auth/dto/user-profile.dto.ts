import { Exclude, Expose } from 'class-transformer';

export class UserProfileDto {
  @Expose()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Expose()
  gender: string;

  @Expose()
  role: string;

  @Expose()
  date_of_birth: string;

  @Expose()
  avatar: string;

  @Expose()
  phone_number: string | null;

  @Expose()
  address: string | null;

  @Expose()
  user_status: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Exclude()
  password: string;

  @Exclude()
  refresh_token: string;

  @Exclude()
  is_deleted: boolean;

  @Exclude()
  delete_at: Date | null;
}
