import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tracking_events')
export class TrackingEvent {
  @PrimaryColumn()
  id!: string;

  @Column()
  loadId!: string;

  @Column({ nullable: true })
  vehicleId?: string;

  @Column({ nullable: true })
  driverId?: string;

  @Column('decimal')
  latitude!: number;

  @Column('decimal')
  longitude!: number;

  @Column({ nullable: true })
  locationName?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  note?: string;

  @Column()
  recordedAt!: string;
}
