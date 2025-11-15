import { WebhookEventDto } from '../dto/webhook-event.dto';

export const createEvent = (
  event_id: string,
  source: string,
  timestamp: string,
  payload?: any,
): WebhookEventDto => ({
  event_id,
  source,
  timestamp,
  payload,
});

export const webhookFixtures = {
  emptyArray: [] as WebhookEventDto[],

  singleEvent: [
    createEvent('evt_001', 'stripe', '2025-11-15T10:30:00Z'),
  ],

  duplicateEvents: [
    createEvent('evt_001', 'stripe', '2025-11-15T10:35:00Z'),
    createEvent('evt_001', 'github', '2025-11-15T10:25:00Z'), // earliest
    createEvent('evt_001', 'shopify', '2025-11-15T10:30:00Z'),
  ],

  timestampTie: [
    createEvent('evt_001', 'stripe', '2025-11-15T10:30:00Z'),
    createEvent('evt_001', 'github', '2025-11-15T10:30:00Z'), // "g" < "s" lexicographically
  ],

  unsortedEvents: [
    createEvent('evt_003', 'stripe', '2025-11-15T10:35:00Z'),
    createEvent('evt_001', 'github', '2025-11-15T10:25:00Z'),
    createEvent('evt_002', 'shopify', '2025-11-15T10:35:00Z'),
  ],

  allDuplicates: [
    createEvent('evt_001', 'stripe', '2025-11-15T10:30:00Z'),
    createEvent('evt_001', 'stripe', '2025-11-15T10:30:00Z'),
    createEvent('evt_001', 'stripe', '2025-11-15T10:30:00Z'),
  ],
};