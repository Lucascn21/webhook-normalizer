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
    const deduplicated = this.deduplicateEvents(events);
    // TODO: sorting will be added later
    return deduplicated;
  }

  private deduplicateEvents(events: WebhookEventDto[]): WebhookEventDto[] {
    const eventMap = new Map<string, WebhookEventDto>();

    for (const event of events) {
      const existing = eventMap.get(event.event_id);

      if (!existing) {
        // First occurrence - just add it
        eventMap.set(event.event_id, event);
      } else {
        // Duplicate found - keep the one with earliest timestamp
        // If timestamps are equal, use lexicographic source as tiebreaker
        const comparison = this.compareEvents(event, existing);
        if (comparison < 0) {
          eventMap.set(event.event_id, event);
        }
      }
    }

    return Array.from(eventMap.values());
  }

  //Consideration: Although we could use string comparison for ISO 8601 timestamps, since the controller will only validate ISO 8601 strings, using Date objects ensures robustness and is a better practice.
  private compareEvents(a: WebhookEventDto, b: WebhookEventDto): number {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    const timeDiff = dateA.getTime() - dateB.getTime();

    if (timeDiff !== 0) {
      return timeDiff < 0 ? -1 : 1;
    }

    // Timestamps are equal - use lexicographic source as tiebreaker
    return a.source.localeCompare(b.source);
  }
}
