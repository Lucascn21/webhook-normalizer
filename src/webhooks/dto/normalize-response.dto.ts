export class NormalizeResponseDto {
  ordered_event_ids: string[];
  unique_count: number;
  first_timestamp: string | null;
  last_timestamp: string | null;
}