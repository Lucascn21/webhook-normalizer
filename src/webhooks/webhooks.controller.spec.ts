import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import request from 'supertest';

describe('WebhooksController', () => {
  let app: INestApplication;

  const makeRequest = (body: any) => {
    return request(app.getHttpServer()).post('/webhooks/normalize').send(body);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [WebhooksService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  /*
Controller Tests Plan:
- should return 400 when events array is missing
- should return 400 when events is not an array
- should return 400 when event_id is missing
- should return 400 when source is missing
- should return 400 when timestamp is missing
- should return 400 when timestamp is not valid ISO8601
- should return 200 with empty result when events array is empty
- should return 200 with normalized data for valid request
*/

  describe('POST /webhooks/normalize', () => {
    it('should return 400 when events array is missing', () => {
      return makeRequest({}).expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when events is not an array', () => {
      return makeRequest({ events: 'not-an-array' }).expect(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('should return 400 when event_id is missing', () => {
      return makeRequest({
        events: [
          {
            source: 'stripe',
            timestamp: '2025-11-15T10:30:00Z',
          },
        ],
      }).expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when source is missing', () => {
      return makeRequest({
        events: [
          {
            event_id: 'evt_001',
            timestamp: '2025-11-15T10:30:00Z',
          },
        ],
      }).expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when timestamp is missing', () => {
      return makeRequest({
        events: [
          {
            event_id: 'evt_001',
            source: 'stripe',
          },
        ],
      }).expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when timestamp is not valid ISO8601', () => {
      return makeRequest({
        events: [
          {
            event_id: 'evt_001',
            source: 'stripe',
            timestamp: 'invalid-date',
          },
        ],
      }).expect(HttpStatus.BAD_REQUEST);
    });

    // Note: Validation of specific error messages was not required in the spec,
    // but in a production environment we would validate error message content
    // to ensure proper error reporting to API consumers.

    it('should return 200 with empty result when events array is empty', () => {
      return makeRequest({ events: [] }).expect(HttpStatus.OK).expect({
        ordered_event_ids: [],
        unique_count: 0,
        first_timestamp: null,
        last_timestamp: null,
      });
    });

    it('should return 200 with normalized data for valid request', () => {
      return makeRequest({
        events: [
          {
            event_id: 'evt_003',
            source: 'stripe',
            timestamp: '2025-11-15T10:35:00Z',
          },
          {
            event_id: 'evt_001',
            source: 'github',
            timestamp: '2025-11-15T10:25:00Z',
          },
          {
            event_id: 'evt_002',
            source: 'shopify',
            timestamp: '2025-11-15T10:35:00Z',
          },
        ],
      })
        .expect(HttpStatus.OK)
        .expect({
          ordered_event_ids: ['evt_001', 'evt_002', 'evt_003'],
          unique_count: 3,
          first_timestamp: '2025-11-15T10:25:00Z',
          last_timestamp: '2025-11-15T10:35:00Z',
        });
    });
  });
});
