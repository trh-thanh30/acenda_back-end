import { Tour } from 'src/modules/tour/entities/tour.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('tour_booking')
export class TourBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User)
  booking_by: User;

  @ManyToOne(() => Tour)
  tour_id: Tour;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  quantityAdult: number;

  @Column()
  quantityChild: number;

  @Column()
  totalPrice: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
