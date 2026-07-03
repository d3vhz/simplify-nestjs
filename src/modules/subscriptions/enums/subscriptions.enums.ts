enum SubscriptionPaymentInterval {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

enum SubscriptionStatus {
  active = 'active',
  paused = 'paused',
  canceled = 'canceled',
  expired = 'expired',
}

enum SubscriptionSortBy {
  createdAt = 'createdAt',
  title = 'title',
  price = 'price',
}

enum SubscriptionTTL {
  SUBSCRIPTION = 300,
  SUBSCRIPTION_LIST = 120,
}

export {
  SubscriptionPaymentInterval,
  SubscriptionStatus,
  SubscriptionSortBy,
  SubscriptionTTL,
};
