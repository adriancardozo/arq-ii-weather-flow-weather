import dotenv from 'dotenv';

dotenv.config({});

const configuration = {
  app: {
    title: 'Weather Flow',
    description: 'Weather Flow API (Arquitectura de Software II)',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
    api_version: process.env.SELF_VERSION ?? '-',
    options: { cors: { allowedHeaders: '*' } },
    docs: { path: 'docs' },
    health_string: 'Hello World!',
    dns_servers: process.env.DNS_SERVERS?.split(',') ?? [],
    request_timeout_ms: process.env.APP_REQUEST_TIMEOUT_MS
      ? parseInt(process.env.APP_REQUEST_TIMEOUT_MS, 10)
      : 1500,
  },
  mongo: { uri: process.env.MONGO_URI! },
  jwt: { secret: process.env.JWT_SECRET! },
  service_bus: { connection_string: process.env.SERVICE_BUS_CONNECTION_STRING! },
  alerts: {
    fallback_enabled: process.env.ALERTS_FALLBACK_ENABLED !== 'false',
  },
  users: {
    url: process.env.USERS_URL!,
    timeout_ms: process.env.USERS_TIMEOUT_MS ? parseInt(process.env.USERS_TIMEOUT_MS, 10) : 1200,
    fallback_enabled: process.env.USERS_FALLBACK_ENABLED !== 'false',
    circuit_breaker: {
      failure_threshold: process.env.USERS_CB_FAILURE_THRESHOLD
        ? parseInt(process.env.USERS_CB_FAILURE_THRESHOLD, 10)
        : 3,
      reset_timeout_ms: process.env.USERS_CB_RESET_TIMEOUT_MS
        ? parseInt(process.env.USERS_CB_RESET_TIMEOUT_MS, 10)
        : 10000,
    },
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
