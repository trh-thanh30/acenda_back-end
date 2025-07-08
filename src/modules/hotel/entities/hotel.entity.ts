import { Address } from 'src/modules/address/entities/address.entity';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { Room } from 'src/modules/room/entities/room.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @Column({ unique: true })
  name: string;
  @Column({ type: 'text' })
  description: string;
  @Column('simple-array', { nullable: true })
  amenities: string[];
  @Column('simple-array', { nullable: true })
  images: string[];
  @OneToOne(() => Address, { cascade: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;
  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
  @OneToMany(() => Booking, (booking) => booking.hotel)
  bookings: Booking[];
  @OneToMany(() => Review, (review) => review.hotel)
  reviews: Review[];
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
}
