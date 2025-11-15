import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import request from 'supertest';

describe('WebhooksController', () => {
  let app: INestApplication;

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
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should return 400 when events is not an array', () => {
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({ events: 'not-an-array' })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should return 400 when event_id is missing', () => {
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({
          events: [
            {
              source: 'stripe',
              timestamp: '2025-11-15T10:30:00Z',
            },
          ],
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should return 400 when source is missing', () => {
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({
          events: [
            {
              event_id: 'evt_001',
              timestamp: '2025-11-15T10:30:00Z',
            },
          ],
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should return 400 when timestamp is missing', () => {
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({
          events: [
            {
              event_id: 'evt_001',
              source: 'stripe',
            },
          ],
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should return 400 when timestamp is not valid ISO8601', () => {
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({
          events: [
            {
              event_id: 'evt_001',
              source: 'stripe',
              timestamp: 'invalid-date',
            },
          ],
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should return 200 with empty result when events array is empty', () => {
      return request(app.getHttpServer())
        .post('/webhooks/normalize')
        .send({ events: [] })
        .expect(HttpStatus.OK)
        .expect({
          ordered_event_ids: [],
          unique_count: 0,
          first_timestamp: null,
          last_timestamp: null,
        });
    });
  });
});
