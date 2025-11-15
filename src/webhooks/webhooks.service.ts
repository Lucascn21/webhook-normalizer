import { Injectable } from '@nestjs/common';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { NormalizeResponseDto } from './dto/normalize-response.dto';

@Injectable()
export class WebhooksService {
  normalize(events: WebhookEventDto[]): NormalizeResponseDto {
    // Handle empty
    if (events.length === 0) {
      return {
        ordered_event_ids: [],
        unique_count: 0,
        first_timestamp: null,
        last_timestamp: null,
      };
    }

    //Harcoded for now
    return {
      ordered_event_ids: [events[0].event_id],
      unique_count: 1,
      first_timestamp: events[0].timestamp,
      last_timestamp: events[0].timestamp,
    };
  }
}
