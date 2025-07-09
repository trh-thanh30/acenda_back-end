import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('tours')
export class Tour {
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

  @Column({ type: 'simple-array' })
  highlights: string[];

  @Column({ type: 'text' })
  planDetails: string;

  @Column({ type: 'text' })
  itinerary: string;

  @Column()
  durationDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAdult: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceChild: number;

  @Column({ nullable: true })
  availableSlots: number;

  @Column()
  travelCostDetails: string;

  @Column()
  address: string;

  @Column({ nullable: true, type: 'text' })
  departure_schedule: string;

  @Column({ nullable: true, type: 'text' })
  surcharge: string;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

  @Column({ default: false })
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
