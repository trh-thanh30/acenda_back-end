import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @Column()
  rating: number;
  @Column()
  title: string;
  @Column('longtext')
  comment: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.reviews, { nullable: true })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  //   @ManyToOne(() => Room, (hotel) => hotel.review, { nullable: true })
  //   @JoinColumn({ name: 'room_id' })
  //   room: Room;
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
