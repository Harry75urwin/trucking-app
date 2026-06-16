import { Entity, PrimaryColumn, Column } from 'typeorm';

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

  @Column({ nullable: true })
  organizationId?: string;

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
