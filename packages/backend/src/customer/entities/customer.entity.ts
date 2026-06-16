import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  contact_name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zip!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
