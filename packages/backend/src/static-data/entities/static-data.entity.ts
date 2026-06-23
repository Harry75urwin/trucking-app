import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('static_data')
export class StaticData {
  @PrimaryColumn()
  id!: string;

  @Column()
  category!: string;

  @Column()
  key!: string;

  @Column()
  value!: string;

  @Column({ nullable: true })
  display_en?: string;

  @Column({ nullable: true })
  display_hi?: string;

  @Column({ nullable: true })
  sort_order?: number;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ nullable: true })
  organization_id?: string;
}
