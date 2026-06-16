import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { UploadService } from './upload.service';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Create a presigned R2 upload URL' })
  @ApiCreatedResponse({ description: 'R2 upload URL created successfully' })
  @UseGuards(JwtAuthGuard)
  @Post('presign')
  createPresignedUpload(@Body() dto: CreatePresignedUploadDto) {
    return this.uploadService.createPresignedUpload(dto);
  }
}
