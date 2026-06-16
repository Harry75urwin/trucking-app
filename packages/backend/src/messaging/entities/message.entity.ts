import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../user/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'conversation_id' })
  conversationId!: string;

  @Column({ name: 'sender_id', type: 'int' })
  senderId!: number;

  @Column({ name: 'receiver_id', type: 'int' })
  receiverId!: number;

  @Column({ type: 'text' })
  body!: string;

  @Column({ name: 'attachment_url', nullable: true })
  attachmentUrl?: string;

  @Column({ name: 'is_read', default: false })
  isRead!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation?: Conversation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver?: User;
}
