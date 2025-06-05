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
@Entity('booking_tour')
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
  @Column({ type: 'date' })
  startDate: Date;
  @Column()
  quantityAdult: number;
  @Column()
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
  @Column({ nullable: true })
  paymentMethod: string;
  @Column({ nullable: true })
  paidAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
