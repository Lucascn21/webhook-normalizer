import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { NormalizeRequestDto } from './dto/normalize-request.dto';
import { NormalizeResponseDto } from './dto/normalize-response.dto';
import { DuplicateRequestGuard } from './guards/duplicate-request.guard';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('normalize')
  @UseGuards(DuplicateRequestGuard)
  @HttpCode(HttpStatus.OK)
  normalize(@Body() request: NormalizeRequestDto): NormalizeResponseDto {
    return this.webhooksService.normalize(request);
  }
}
