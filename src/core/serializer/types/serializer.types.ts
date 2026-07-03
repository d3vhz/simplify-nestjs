type CacheSerializer = {
  serialize(value: unknown): string | Buffer;
  deserialize<T>(value: string | Buffer): T;
};

export type { CacheSerializer };
