import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const ALL_ROLES = ['admin', 'dispatcher', 'fleet_manager', 'driver', 'customer'];

@ApiTags('messaging')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @ApiOperation({ summary: 'Create a conversation' })
  @Roles(...ALL_ROLES)
  @ApiCreatedResponse({ description: 'Conversation created successfully' })
  @Post('conversations')
  createConversation(@Body() dto: CreateConversationDto & { userId: number }) {
    return this.messagingService.createConversation(dto);
  }

  @ApiOperation({ summary: 'List conversations for current user' })
  @Roles(...ALL_ROLES)
  @ApiOkResponse({ description: 'Conversations returned successfully' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @Get('conversations')
  findAllConversations(@Query('userId') userId: string) {
    return this.messagingService.findAllConversations(Number(userId));
  }

  @ApiOperation({ summary: 'Get a conversation by id' })
  @Roles(...ALL_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Conversation returned successfully' })
  @Get('conversations/:id')
  findOneConversation(
    @Query('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.messagingService.findOneConversation(id, Number(userId));
  }

  @ApiOperation({ summary: 'Send a message' })
  @Roles(...ALL_ROLES)
  @ApiCreatedResponse({ description: 'Message sent successfully' })
  @Post('messages')
  sendMessage(@Body() dto: CreateMessageDto & { senderId: number }) {
    return this.messagingService.sendMessage(dto);
  }

  @ApiOperation({ summary: 'List messages in a conversation' })
  @Roles(...ALL_ROLES)
  @ApiOkResponse({ description: 'Messages returned successfully' })
  @ApiParam({ name: 'conversationId', type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('conversations/:conversationId/messages')
  findMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagingService.findMessages(
      conversationId,
      limit ? Number(limit) : undefined,
    );
  }

  @ApiOperation({ summary: 'Mark message as read' })
  @Roles(...ALL_ROLES)
  @ApiOkResponse({ description: 'Message marked as read' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @Patch('messages/:id/read')
  markAsRead(@Query('userId') userId: string, @Param('id') id: string) {
    return this.messagingService.markAsRead(id, Number(userId));
  }
}
