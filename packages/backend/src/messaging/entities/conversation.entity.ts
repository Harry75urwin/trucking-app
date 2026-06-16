import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'load_id', nullable: true })
  loadId?: string;

  @Column({ name: 'organization_id', type: 'int', nullable: true })
  organizationId?: number;

  @Column({ name: 'created_by', type: 'int' })
  createdBy!: number;

  @Column({ name: 'receiver_id', type: 'int', nullable: true })
  receiverId?: number;

  @Column({ name: 'last_message_at', type: 'timestamp', nullable: true })
  lastMessageAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver?: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages?: Message[];
}
