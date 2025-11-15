import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { NormalizeRequestDto } from './dto/normalize-request.dto';
import { NormalizeResponseDto } from './dto/normalize-response.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('normalize')
  normalize(@Body() request: NormalizeRequestDto): NormalizeResponseDto {
    return this.webhooksService.normalize(request.events);
  }
}
