import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  primaryColor?: string;

  @Column({ nullable: true })
  ownerUserId?: number;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
