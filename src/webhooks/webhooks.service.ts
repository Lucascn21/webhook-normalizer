import { Injectable } from '@nestjs/common';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { NormalizeResponseDto } from './dto/normalize-response.dto';

//Consideration: Normally i would use an enum file but for legiblity in this context i am keeping it here.
enum EventComparison {
  KEEP_NEW = -1,
  EQUIVALENT = 0,
  KEEP_EXISTING = 1,
}

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
        if (comparison === EventComparison.KEEP_NEW) {
          eventMap.set(event.event_id, event);
        }
      }
    }

    return Array.from(eventMap.values());
  }

  //Consideration: Although we could use string comparison for ISO 8601 timestamps, since the controller will only validate ISO 8601 strings, using Date objects ensures robustness and is a better practice.
  private compareEvents(
    newEvent: WebhookEventDto,
    existingEvent: WebhookEventDto,
  ): EventComparison {
    const newEventTime = new Date(newEvent.timestamp).getTime();
    const existingEventTime = new Date(existingEvent.timestamp).getTime();

    if (newEventTime < existingEventTime) {
      return EventComparison.KEEP_NEW;
    }
    if (newEventTime > existingEventTime) {
      return EventComparison.KEEP_EXISTING;
    }

    // Timestamps are equal - use lexicographic source as tiebreaker
    const sourceComparison = newEvent.source.localeCompare(
      existingEvent.source,
    );
    if (sourceComparison < 0) return EventComparison.KEEP_NEW;
    if (sourceComparison > 0) return EventComparison.KEEP_EXISTING;
    return EventComparison.EQUIVALENT;
  }
}
