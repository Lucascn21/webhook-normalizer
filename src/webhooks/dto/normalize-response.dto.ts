import { WebhookEventDto } from './webhook-event.dto';

export class NormalizeResponseDto {
  ordered_event_ids: string[];
  unique_count: number;
  first_timestamp: string | null;
  last_timestamp: string | null;

  static empty(): NormalizeResponseDto {
    const response = new NormalizeResponseDto();
    response.ordered_event_ids = [];
    response.unique_count = 0;
    response.first_timestamp = null;
    response.last_timestamp = null;
    return response;
  }

  static fromEvents(events: WebhookEventDto[]): NormalizeResponseDto {
    const response = new NormalizeResponseDto();
    response.ordered_event_ids = events.map((e) => e.event_id);
    response.unique_count = events.length;
    response.first_timestamp = events[0]?.timestamp ?? null;
    response.last_timestamp = events[events.length - 1]?.timestamp ?? null;
    return response;
  }
}
