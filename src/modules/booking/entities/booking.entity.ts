import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { Room } from 'src/modules/room/entities/room.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

export enum bookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}
@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @Column({ type: 'date' })
  check_in_date: string;
  @Column({ type: 'date' })
  check_out_date: string;

  @Column()
  number_of_guests: number;
  @Column({ type: 'enum', enum: bookingStatus, default: bookingStatus.PENDING })
  status: bookingStatus;
  @Column({ nullable: true })
  total_price: number;

  @ManyToOne(() => User, (user) => user.bookings)
  booking_by: User;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;

  @ManyToOne(() => Hotel, (hotel) => hotel.bookings)
  hotel: Hotel;

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
}
