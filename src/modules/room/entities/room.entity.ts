import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  capacity: number;
  @Column()
  price: number;
  @Column()
  isAvailable: boolean;
  @Column('simple-array', { nullable: true })
  amenities: string[];
  @Column('simple-array', { nullable: true })
  images: string[];
  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;
  @Column({ default: 1 })
  quantity: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;
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
  // more
  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
  @OneToMany(() => Review, (review) => review.room)
  reviews: Review[];
}
