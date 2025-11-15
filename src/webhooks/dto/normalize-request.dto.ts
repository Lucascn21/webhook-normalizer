import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WebhookEventDto } from './webhook-event.dto';

export class NormalizeRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookEventDto)
  events: WebhookEventDto[];
}
