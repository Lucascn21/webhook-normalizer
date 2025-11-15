import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { createHash } from 'crypto';

/**
 * Guard to detect and reject duplicate webhook requests based on request body hash.
 *
 * Note: This is a proof-of-concept implementation demonstrating idempotency awareness
 * and request hashing (topics discussed in interview). In a production system:
 * - Exception messages would be centralized in constants/i18n files
 * - Error handling would be managed by a global exception filter
 * - Cache would use Redis/distributed storage instead of in-memory Map
 * - TTL and cache strategy would be configurable via environment variables
 */
@Injectable()
export class DuplicateRequestGuard implements CanActivate {
  private readonly requestCache = new Map<string, number>();
  private readonly CACHE_TTL_MS = 60000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requestHash = this.hashRequestBody(request.body);

    const cachedTimestamp = this.requestCache.get(requestHash);

    if (cachedTimestamp) {
      const age = Date.now() - cachedTimestamp;
      if (age < this.CACHE_TTL_MS) {
        // Note: Hardcoded message for simplicity. Production would use centralized error constants.
        throw new ConflictException(
          'Duplicate request detected. Please wait before retrying.',
        );
      }
    }

    // Store request hash with timestamp
    this.requestCache.set(requestHash, Date.now());

    // Cleanup old entries periodically
    this.cleanupExpiredEntries();

    return true;
  }

  private hashRequestBody(body: any): string {
    const normalized = JSON.stringify(body);
    return createHash('sha256').update(normalized).digest('hex');
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [hash, timestamp] of this.requestCache.entries()) {
      if (now - timestamp >= this.CACHE_TTL_MS) {
        this.requestCache.delete(hash);
      }
    }
  }
}
