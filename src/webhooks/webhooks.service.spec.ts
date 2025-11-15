import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { webhookFixtures } from './test/fixtures';

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
  describe('normalize', () => {
    //Presumption: An empty array of events should be expected to return an empty normalization result.
    it('should handle empty array', () => {
      const result = service.normalize(webhookFixtures.emptyArray);

      expect(result).toEqual({
        ordered_event_ids: [],
        unique_count: 0,
        first_timestamp: null,
        last_timestamp: null,
      });
    });

    it('should handle single event', () => {
      const result = service.normalize(webhookFixtures.singleEvent);

      expect(result).toEqual({
        ordered_event_ids: ['evt_001'],
        unique_count: 1,
        first_timestamp: '2025-11-15T10:30:00Z',
        last_timestamp: '2025-11-15T10:30:00Z',
      });
    });

    it('should deduplicate by event_id keeping earliest timestamp', () => {
      const result = service.normalize(webhookFixtures.duplicateEvents);
      expect(result.unique_count).toBe(1);
      expect(result.ordered_event_ids).toEqual(['evt_001']);
      expect(result.first_timestamp).toBe('2025-11-15T10:25:00Z'); // earliest
      expect(result.last_timestamp).toBe('2025-11-15T10:25:00Z');
    });

    // Note: Expected Output doesn't return source, so we can only verify deduplication occurred, not which source was kept
    it('should use lexicographic source as tiebreaker when timestamps equal', () => {
      const result = service.normalize(webhookFixtures.timestampTie);
      expect(result.unique_count).toBe(1);
      expect(result.ordered_event_ids).toEqual(['evt_001']);
    });

    it('should sort events by timestamp ascending, then by event_id ascending', () => {
      const result = service.normalize(webhookFixtures.unsortedEvents);

      expect(result.ordered_event_ids).toEqual([
        'evt_001',
        'evt_002',
        'evt_003',
      ]);
      expect(result.first_timestamp).toBe('2025-11-15T10:25:00Z');
      expect(result.last_timestamp).toBe('2025-11-15T10:35:00Z');
      expect(result.unique_count).toBe(3);
    });

    it('should handle all duplicates', () => {
      const result = service.normalize(webhookFixtures.allDuplicates);

      expect(result.unique_count).toBe(1);
      expect(result.ordered_event_ids).toEqual(['evt_001']);
      expect(result.first_timestamp).toBe('2025-11-15T10:30:00Z');
      expect(result.last_timestamp).toBe('2025-11-15T10:30:00Z');
    });
  });
});
