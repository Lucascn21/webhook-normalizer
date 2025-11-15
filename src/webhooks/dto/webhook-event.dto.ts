import { IsString, IsISO8601, IsOptional } from 'class-validator';

export class WebhookEventDto {
  @IsString()
  event_id: string;

  @IsString()
  source: string;

  @IsISO8601()
  timestamp: string;

  @IsOptional()
  payload?: any;
}
