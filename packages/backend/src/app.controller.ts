import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ErrorResponseDto } from './common/dto/error-response.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'Welcome message' })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
