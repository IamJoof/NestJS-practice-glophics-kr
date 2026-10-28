import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NormalizeStringsPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body' && metadata.type !== 'query') {
      return value;
    }

    return this.sanitize(value);
  }

  private sanitize(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim().replace(/\s+/g, ' ');
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    if (value !== null && typeof value === 'object') {
      const sanitizedObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitizedObj[key] = this.sanitize(val);
      }
      return sanitizedObj;
    }

    return value;
  }
}