import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('load_assignments')
export class LoadAssignment {
  @PrimaryColumn()
  id!: string;

  @Column()
  load_id!: string;

  @Column({ nullable: true, type: 'varchar' })
  driver_id?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  truck_id?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  trailer_id?: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: string;
}
