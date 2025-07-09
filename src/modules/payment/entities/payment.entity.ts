import { Min } from 'class-validator';
import { Tour } from 'src/modules/tour/entities/tour.entity';
import { User } from 'src/modules/users/entities/user.entity';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
export enum tourBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}
export enum tourPaymentMethod {
  CASH = 'cash',
  ONLINE = 'online',
}
@Entity('payment')
export class TourBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Tour)
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;
  @Column()
  userName: string;
  @Column()
  userEmail: string;
  @Column()
  userPhone: string;
  @Column({ type: 'date' })
  startDate: Date;
  @Column({ type: 'text', nullable: true })
  specialRequest: string;
  @Column()
  @Min(0)
  quantityAdult: number;
  @Column()
  @Min(0)
  quantityChild: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;
  @Column({
    type: 'enum',
    enum: tourBookingStatus,
    default: tourBookingStatus.PENDING,
  })
  status: tourBookingStatus;

  @Column({ default: false })
  isPaid: boolean;
  @Column({ type: 'enum', enum: tourPaymentMethod, nullable: true })
  paymentMethod: string;
  @Column({ nullable: true })
  paidAt: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
