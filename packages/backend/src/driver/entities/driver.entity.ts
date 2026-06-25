import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryColumn()
  id!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  cdl_number!: string;

  @Column({ nullable: true })
  cdl_expiry?: string;

  @Column({ nullable: true })
  medical_expiry?: string;

  @Column({ nullable: true })
  home_city?: string;

  @Column({ nullable: true })
  home_state?: string;

  @Column()
  status!: string;

  @Column({ nullable: true })
  organizationId?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
