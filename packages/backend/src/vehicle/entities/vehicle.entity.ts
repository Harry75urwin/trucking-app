import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn()
  id!: string;

  @Column()
  unit_number!: string;

  @Column()
  type!: string;

  @Column()
  year!: number;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column()
  license_plate!: string;

  @Column()
  mileage!: number;

  @Column()
  next_service_miles!: number;

  @Column({
    name: 'image_urls',
    type: 'jsonb',
    nullable: true,
    default: () => "'[]'::jsonb",
  })
  imageUrls?: string[];

  @Column()
  status!: string;

  @Column({ nullable: true })
  driverId?: string;

  @Column({ nullable: true })
  organizationId?: number;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver?: Driver;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
