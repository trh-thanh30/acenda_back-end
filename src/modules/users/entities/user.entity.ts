import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

export enum userRole {
  ADMIN = 'admin',
  ADMIN_HOTEL = 'admin_hotel',
  CUSTOMER = 'customer',
}
export enum userGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export enum userStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: userRole, default: userRole.CUSTOMER })
  role: userRole;
  @Column({ type: 'enum', enum: userGender, default: userGender.OTHER })
  gender: userGender;
  @Column({ type: 'date' })
  date_of_birth: Date;
  @Column({ nullable: true })
  avatar: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  code_id: string;
  @Column({ nullable: true, type: 'text' })
  refresh_token: string;
  @Column({ nullable: true })
  code_expired: Date;
  @Column({ type: 'enum', enum: userStatus, default: userStatus.INACTIVE })
  user_status: userStatus;
  @Column({ nullable: true, default: false })
  is_active: boolean;
  @Column({ nullable: true, default: false })
  is_deleted: boolean;
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  delete_at: Date | null;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
  // created_by, updated_by, deleted_by
}
