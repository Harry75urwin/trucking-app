import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
    credentials: true,
  },
  namespace: '/messaging',
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<number, Set<Socket>>();

  constructor(private readonly messagingService: MessagingService) {}

  handleConnection(client: Socket) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    client.join(`user:${userId}`);

    const sockets = this.userSocketMap.get(userId) ?? new Set<Socket>();
    sockets.add(client);
    this.userSocketMap.set(userId, sockets);

    client.emit('connected', { message: 'Connected to messaging gateway' });
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) return;

    const sockets = this.userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(client);
      if (sockets.size === 0) {
        this.userSocketMap.delete(userId);
      }
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    client.emit('joinedConversation', { conversationId: data.conversationId });
    return { event: 'joinedConversation', data: { conversationId: data.conversationId } };
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    return { event: 'leftConversation', data: { conversationId: data.conversationId } };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto & { senderId: number },
  ) {
    const message = await this.messagingService.sendMessage({
      conversationId: data.conversationId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      body: data.body,
      attachmentUrl: data.attachmentUrl,
    });

    this.server.to(`user:${message.senderId}`).emit('newMessage', message);
    this.server.to(`user:${message.receiverId}`).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) return { event: 'error', data: { message: 'Unauthorized' } };

    const message = await this.messagingService.markAsRead(data.messageId, userId);
    if (!message) return { event: 'error', data: { message: 'Message not found' } };

    this.server.to(`user:${message.senderId}`).emit('messageRead', { messageId: data.messageId });
    return { event: 'messageRead', data: { messageId: data.messageId } };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('userTyping', {
      conversationId: data.conversationId,
      userId: this.getUserIdFromClient(client),
    });
    return { event: 'userTyping', data: { conversationId: data.conversationId } };
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('userStopTyping', {
      conversationId: data.conversationId,
      userId: this.getUserIdFromClient(client),
    });
    return { event: 'userStopTyping', data: { conversationId: data.conversationId } };
  }

  private getUserIdFromClient(client: Socket): number | null {
    const handshake = client.handshake;
    const token = (handshake.auth?.token ?? handshake.headers?.authorization ?? '') as string;
    const match = token.match(/Bearer\s+(.+)/i);
    if (!match) return null;

    try {
      const payload = JSON.parse(
        Buffer.from(match[1].split('.')[1], 'base64url').toString('utf-8'),
      );
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
}
