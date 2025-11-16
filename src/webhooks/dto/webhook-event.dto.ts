import { IsString, IsISO8601, IsOptional, IsObject } from 'class-validator';

export class WebhookEventDto {
  @IsString()
  event_id: string;

  @IsString()
  source: string;

  @IsISO8601()
  timestamp: string;

  // Presumption: Although payload structure is not specified in requirements,
  // we validate it's at least an object if present to ensure data integrity.
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
