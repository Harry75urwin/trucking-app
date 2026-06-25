import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Load } from '../../load/entities/load.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';

@Entity('dispatches')
export class Dispatch {
  @PrimaryColumn()
  id!: string;

  @Column()
  loadId!: string;

  @Column()
  driverId!: string;

  @Column()
  vehicleId!: string;

  @ManyToOne(() => Load, { nullable: true })
  @JoinColumn({ name: 'loadId' })
  load?: Load;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver?: Driver;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  organizationId?: number;

  @Column({ nullable: true })
  scheduledAt?: string;

  @Column({ nullable: true })
  dispatchedAt?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: string;
}
