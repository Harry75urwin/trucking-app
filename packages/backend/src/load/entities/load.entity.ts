import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

@Entity('loads')
export class Load {
  @PrimaryColumn()
  id!: string;

  @Column()
  load_number!: string;

  @Column()
  customer_id!: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column()
  origin_city!: string;

  @Column()
  origin_state!: string;

  @Column()
  destination_city!: string;

  @Column()
  destination_state!: string;

  @Column({ nullable: true })
  pickup_date?: string;

  @Column({ nullable: true })
  delivery_date?: string;

  @Column()
  commodity!: string;

  @Column()
  weight_lbs!: number;

  @Column()
  miles!: number;

  @Column()
  rate!: number;

  @Column()
  fuel_surcharge!: number;

  @Column()
  detention!: number;

  @Column({ nullable: true })
  total_revenue?: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({
    name: 'image_urls',
    type: 'jsonb',
    nullable: true,
    default: () => "'[]'::jsonb",
  })
  imageUrls?: string[];

  @Column()
  status!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
