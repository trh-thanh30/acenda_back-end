import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @Column({
    unique: true,
  })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  // Người tạo bài viết
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  // Người cập nhật gần nhất
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  // Người xoá (soft delete)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at: Date;
}
