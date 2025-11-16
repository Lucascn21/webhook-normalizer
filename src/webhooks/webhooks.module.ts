import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { DuplicateRequestGuard } from './guards/duplicate-request.guard';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService, DuplicateRequestGuard],
})
export class WebhooksModule {}
