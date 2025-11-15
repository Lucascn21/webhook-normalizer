import { Injectable } from '@nestjs/common';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { NormalizeResponseDto } from './dto/normalize-response.dto';

@Injectable()
export class WebhooksService {
  normalize(events: WebhookEventDto[]): NormalizeResponseDto {
    return {
      ordered_event_ids: [],
      unique_count: 0,
      first_timestamp: null,
      last_timestamp: null,
    };
  }
}
