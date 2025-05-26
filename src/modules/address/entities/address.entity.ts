import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
  @Column()
  province: string;
  @Column()
  district: string;
  @Column()
  commune: string;
  @Column()
  detail_address: string;
  @Column({ nullable: true })
  is_deleted: boolean;
  @OneToOne(() => Hotel)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;
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
