import { Entity, PrimaryColumn, Column } from 'typeorm';

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
    default: () => '[]',
  })
  imageUrls?: string[];

  @Column()
  status!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
