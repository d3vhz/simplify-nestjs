const SubscriptionCacheKeys = {
  one({ userId, id }: { userId: string; id: string }) {
    return `subscription:${userId}:${id}`;
  },

  list(userId: string) {
    return `subscriptions:${userId}:list`;
  },

  onePattern(userId: string) {
    return `subscription:${userId}:*`;
  },

  listPattern(userId: string) {
    return `subscriptions:${userId}:list:*`;
  },
};

export { SubscriptionCacheKeys };
