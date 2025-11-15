import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

describe('WebhooksController', () => {
  let controller: WebhooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [WebhooksService],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
  });

  /*
Controller Tests Plan:
- should be defined
- should return 400 when events array is missing
- should return 400 when events is not an array
- should return 400 when event_id is missing
- should return 400 when source is missing
- should return 400 when timestamp is missing
- should return 400 when timestamp is not valid ISO8601
- should return 200 with empty result when events array is empty
- should return 200 with normalized data for valid request
*/
});
