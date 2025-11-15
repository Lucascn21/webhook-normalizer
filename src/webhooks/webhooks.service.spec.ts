import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';

describe('WebhooksService', () => {
  let service: WebhooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhooksService],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /*
  - should handle empty array
  - should handle single event  
  - should deduplicate by event_id keeping earliest timestamp
  - should use lexicographic source as tiebreaker when timestamps equal
  - should sort by timestamp ASC, then event_id ASC
  - should handle all duplicates
  */
  //Presumption: An empty array of events should be expected to return an empty normalization result.
  it('should handle empty array', () => {
    const result = service.normalize([]);
    expect(result).toEqual({
      ordered_event_ids: [],
      unique_count: 0,
      first_timestamp: null,
      last_timestamp: null,
    });
  });
});
