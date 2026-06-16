import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';

@Entity('load_templates')
export class LoadTemplate {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

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
  notes?: string;

  @Column({ default: 0 })
  usage_count!: number;

  @Column()
  organization_id!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
