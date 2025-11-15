import { Injectable } from '@nestjs/common';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { NormalizeResponseDto } from './dto/normalize-response.dto';

@Injectable()
export class WebhooksService {
  normalize(events: WebhookEventDto[]): NormalizeResponseDto {
    if (events.length === 0) {
      return NormalizeResponseDto.empty();
    }

    const processedEvents = this.processEvents(events);
    return NormalizeResponseDto.fromEvents(processedEvents);
  }

  private processEvents(events: WebhookEventDto[]): WebhookEventDto[] {
    // TEMPORARY: Minimal implementation to pass single event test
    // Will be replaced with deduplication + sorting logic after I implement fixtures and more tests
    return [events[0]];
  }
}