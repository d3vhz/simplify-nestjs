const UserCacheKeys = {
  one(userId: string) {
    return `user:${userId}`;
  },
};

export { UserCacheKeys };
