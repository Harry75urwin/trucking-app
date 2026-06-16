import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  salt?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true })
  organizationId?: number;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
