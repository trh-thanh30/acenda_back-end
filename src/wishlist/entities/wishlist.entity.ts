import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { Tour } from 'src/modules/tour/entities/tour.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @ManyToOne(() => User, (user) => user.wishlists, { cascade: false })
  user: User;
  @ManyToOne(() => Tour)
  tour: Tour;
  @ManyToOne(() => Hotel)
  hotel: Hotel;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
