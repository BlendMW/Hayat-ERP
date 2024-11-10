import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Flight related models
  Flight: a.model({
    flightNumber: a.string(),
    departureTime: a.string(),
    arrivalTime: a.string(),
    origin: a.string(),
    destination: a.string(),
    availableSeats: a.integer(),
    basePrice: a.float(),
    status: a.string(),
    isCharterFlight: a.boolean(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.owner().to(['create', 'update', 'delete'])
  ]),

  // Booking related models
  Booking: a.model({
    userId: a.string(),
    flightId: a.string(),
    status: a.string(),
    totalPrice: a.float(),
    holdExpiresAt: a.string(),
    departureTime: a.string(),
    reminderSent: a.boolean(),
  }).authorization((rules) => [
    rules.owner().to(['read', 'update']),
    rules.authenticated().to(['create'])
  ]),

  // Tenant related models
  Tenant: a.model({
    name: a.string(),
    status: a.string(),
    creditLimit: a.float(),
    balance: a.float(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.group('TENANT_ADMIN').to(['create', 'update', 'delete'])
  ]),

  // Loyalty related models
  LoyaltyProgram: a.model({
    tenantId: a.string(),
    pointsPerCurrency: a.float(),
    expirationMonths: a.integer(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.owner().to(['create', 'update', 'delete'])
  ]),

  // Transaction related models
  Transaction: a.model({
    userId: a.string(),
    type: a.string(),
    points: a.integer(),
    description: a.string(),
    bookingId: a.string(),
    expiresAt: a.string(),
  }).authorization((rules) => [
    rules.owner().to(['read']),
    rules.authenticated().to(['create'])
  ]),

  // Notification related models
  Notification: a.model({
    userId: a.string(),
    type: a.string(),
    content: a.string(),
    status: a.string(),
    scheduledFor: a.string(),
  }).authorization((rules) => [
    rules.owner().to(['read']),
    rules.authenticated().to(['create'])
  ]),

  User: a.model({
    email: a.string(),
    password: a.string(),
  }).authorization((rules) => [
    rules.owner().to(['read', 'update']),
    rules.authenticated().to(['create'])
  ]),

  TenantUser: a.model({
    tenantId: a.string(),
    userId: a.string(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.owner().to(['create', 'delete'])
  ]),

  TenantAdmin: a.model({
    tenantId: a.string(),
    userId: a.string(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.group('TENANT_ADMIN').to(['create', 'delete'])
  ]),

  B2BUser: a.model({
    tenantId: a.string(),
    userId: a.string(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.group('B2B_USER').to(['create', 'delete'])
  ]),

  B2BAdmin: a.model({
    tenantId: a.string(),
    userId: a.string(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.group('B2B_ADMIN').to(['create', 'delete'])
  ]),

  Guest: a.model({
    email: a.string(),
  }).authorization((rules) => [
    rules.publicApiKey().to(['create', 'read'])
  ]),

  Admin: a.model({
    email: a.string(),
  }).authorization((rules) => [
    rules.authenticated().to(['read']),
    rules.group('ADMIN').to(['create', 'update', 'delete'])
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  },
});
