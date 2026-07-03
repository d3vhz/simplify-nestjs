import { Injectable } from '@nestjs/common';
import superjson from 'superjson';

import { CacheSerializer } from '../types';

@Injectable()
export class SerializerService implements CacheSerializer {
  serialize(value: unknown) {
    return superjson.stringify(value);
  }

  deserialize<T>(value: string) {
    return superjson.parse<T>(value);
  }
}
