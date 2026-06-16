import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('loads')
export class Load {
  @PrimaryColumn()
  id!: string;

  @Column()
  load_number!: string;

  @Column()
  customer_id!: string;

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

  @Column({ name: 'image_urls', type: 'jsonb', nullable: true, default: () => '[]' })
  imageUrls?: string[];

  @Column()
  status!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
