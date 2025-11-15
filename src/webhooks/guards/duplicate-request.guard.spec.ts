import { DuplicateRequestGuard } from './duplicate-request.guard';
import { ExecutionContext, ConflictException } from '@nestjs/common';

describe('DuplicateRequestGuard', () => {
  let guard: DuplicateRequestGuard;

  beforeEach(() => {
    guard = new DuplicateRequestGuard();
  });

  const createMockContext = (body: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ body }),
      }),
    } as ExecutionContext;
  };

  it('should allow first request', () => {
    const context = createMockContext({ events: [] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should block duplicate request within TTL', () => {
    const body = { events: [{ event_id: 'evt_001' }] };
    const context1 = createMockContext(body);
    const context2 = createMockContext(body);

    guard.canActivate(context1);

    expect(() => guard.canActivate(context2)).toThrow(ConflictException);
    expect(() => guard.canActivate(context2)).toThrow(
      'Duplicate request detected',
    );
  });

  it('should allow different requests', () => {
    const context1 = createMockContext({ events: [{ event_id: 'evt_001' }] });
    const context2 = createMockContext({ events: [{ event_id: 'evt_002' }] });

    expect(guard.canActivate(context1)).toBe(true);
    expect(guard.canActivate(context2)).toBe(true);
  });

  it('should generate same hash for identical bodies', () => {
    const body = { events: [{ event_id: 'evt_001' }] };
    const context1 = createMockContext(body);
    const context2 = createMockContext({ ...body });

    guard.canActivate(context1);

    expect(() => guard.canActivate(context2)).toThrow(ConflictException);
  });
});
