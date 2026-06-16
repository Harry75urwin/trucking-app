import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { In, FindOperator } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private isDemoDataEnabled() {
    return ['1', 'true', 'yes'].includes(
      (this.configService.get<string>('DEMO_DATA_ENABLED') ?? '')
        .trim()
        .toLowerCase(),
    );
  }

  async seedDemoData() {
    if (!this.isDemoDataEnabled()) return;
    const users = await this.userRepository.find();
    if (users.length < 2) return;
    const creator = users[0];
    const participant = users[1];
    const existing = await this.conversationRepository.count();
    if (existing > 0) return;
    const conv = this.conversationRepository.create({
      id: generateId(),
      loadId: 'LD-1001',
      organizationId: creator.organizationId ?? undefined,
      createdBy: creator.id,
      receiverId: participant.id,
    });
    await this.conversationRepository.save(conv);
    const welcome = this.messageRepository.create({
      id: generateId(),
      conversationId: conv.id,
      senderId: creator.id,
      receiverId: participant.id,
      body: 'Welcome to the load conversation. Use this channel to coordinate pickup and delivery details.',
      isRead: true,
    });
    await this.messageRepository.save(welcome);
  }

  createConversation(dto: CreateConversationDto & { userId: number }) {
    const conversation = this.conversationRepository.create({
      id: generateId(),
      loadId: dto.loadId,
      organizationId: dto.organizationId,
      createdBy: dto.userId,
      receiverId: dto.receiverId,
    });
    return this.conversationRepository.save(conversation);
  }

  async findAllConversations(userId: number) {
    const conversations = await this.conversationRepository.find({
      where: [{ createdBy: userId }, { receiverId: userId }],
      order: { updatedAt: 'DESC' },
    });
    if (conversations.length === 0) return [];
    const conversationIds = conversations.map((c) => c.id);
    const allMessages = await this.messageRepository.find({
      order: { createdAt: 'ASC' },
    });
    const messages = allMessages.filter((m) =>
      conversationIds.includes(m.conversationId),
    );
    const senderIds = Array.from(
      new Set(
        messages
          .map((m) => m.senderId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    const receiverIds = Array.from(
      new Set(
        messages
          .map((m) => m.receiverId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    const allUserIds = Array.from(
      new Set([
        ...senderIds,
        ...receiverIds,
        ...conversations.map((c) => c.createdBy),
        ...conversations
          .map((c) => c.receiverId)
          .filter((id): id is number => typeof id === 'number'),
      ]),
    );
    const users =
      allUserIds.length > 0
        ? await this.userRepository.find({
            where: { id: In(allUserIds) as FindOperator<number> },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u]));
    const messagesByConversation = new Map<string, typeof messages>();
    for (const msg of messages) {
      const arr = messagesByConversation.get(msg.conversationId) ?? [];
      arr.push(msg);
      messagesByConversation.set(msg.conversationId, arr);
    }
    return conversations.map((c) => {
      const conversationMessages = messagesByConversation.get(c.id) ?? [];
      const last =
        conversationMessages.length > 0
          ? conversationMessages[conversationMessages.length - 1]
          : undefined;
      return {
        ...c,
        creator: userMap.get(c.createdBy) ?? undefined,
        receiver: c.receiverId ? userMap.get(c.receiverId) : undefined,
        lastMessage: last,
      };
    });
  }

  async findOneConversation(id: string, userId: number) {
    const conversation = await this.conversationRepository.findOne({
      where: [
        { id, createdBy: userId },
        { id, receiverId: userId },
      ],
    });
    if (!conversation) return null;
    const [creator, receiver] = await Promise.all([
      conversation.createdBy
        ? this.userRepository.findOne({ where: { id: conversation.createdBy } })
        : Promise.resolve(null),
      conversation.receiverId
        ? this.userRepository.findOne({
            where: { id: conversation.receiverId },
          })
        : Promise.resolve(null),
    ]);
    return { ...conversation, creator, receiver };
  }

  async findMessages(conversationId: string, limit = 50) {
    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
    if (messages.length === 0) return messages;
    const senderIds = Array.from(
      new Set(
        messages
          .map((m) => m.senderId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    const receiverIds = Array.from(
      new Set(
        messages
          .map((m) => m.receiverId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    const allUserIds = Array.from(new Set([...senderIds, ...receiverIds]));
    const users =
      allUserIds.length > 0
        ? await this.userRepository.find({
            where: { id: In(allUserIds) as FindOperator<number> },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u]));
    return messages.map((m) => ({
      ...m,
      sender: userMap.get(m.senderId) ?? undefined,
      receiver: userMap.get(m.receiverId) ?? undefined,
    }));
  }

  async sendMessage(dto: CreateMessageDto & { senderId: number }) {
    const message = this.messageRepository.create({
      id: generateId(),
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      body: dto.body,
      attachmentUrl: dto.attachmentUrl,
      isRead: false,
    });
    const saved = await this.messageRepository.save(message);
    await this.conversationRepository.update(dto.conversationId, {
      lastMessageAt: saved.createdAt,
      updatedAt: saved.createdAt,
    });
    return saved;
  }

  async markAsRead(messageId: string, userId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, receiverId: userId },
    });
    if (!message || message.isRead) return message;
    await this.messageRepository.update(messageId, { isRead: true });
    const updated = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    return updated;
  }
}
