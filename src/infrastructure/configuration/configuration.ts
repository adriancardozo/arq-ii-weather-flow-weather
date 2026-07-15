import dotenv from 'dotenv';
import { KeyvRedisOptions } from '@keyv/redis';

dotenv.config({});

const cache_disabled = process.env.CACHE_DISABLED ? process.env.CACHE_DISABLED === 'true' : false;

function ttl(ttl: number): number {
  return cache_disabled ? -1 : ttl;
}

const service_bus_connection_string = process.env.SERVICE_BUS_CONNECTION_STRING!;

const emulator_string = 'UseDevelopmentEmulator=true';

const service_bus_emulated = (service_bus_connection_string ?? '').includes(emulator_string);

const configuration = {
  app: {
    title: 'Weather Flow - Weather',
    description: 'Weather Flow - Weather API (Arquitectura de Software II)',
    service_name: 'weather',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
    api_version: process.env.SELF_VERSION ?? '-',
    options: { cors: { allowedHeaders: '*' } },
    docs: { path: 'docs' },
    health_string: 'Hello World!',
    dns_servers: process.env.DNS_SERVERS?.split(',') ?? [],
  },
  mongo: { uri: process.env.MONGO_URI! },
  jwt: { secret: process.env.JWT_SECRET! },
  service_bus: { connection_string: service_bus_connection_string, emulated: service_bus_emulated },
  users: { url: process.env.USERS_URL! },
  open_weather_map: { url: process.env.OPEN_WEATHER_MAP_URL!, api_key: process.env.OPEN_WEATHER_MAP_KEY! },
  redis: {
    url: process.env.REDIS_CACHE_URL,
    options: { connectionTimeout: process.env.REDIS_CACHE_CONNECTION_TIMEOUT ?? 2000 } as KeyvRedisOptions,
  },
  cache: {
    disabled: cache_disabled,
    ttl: { average_day: ttl(60 * 60 * 1000), average_week: ttl(24 * 60 * 60 * 1000) },
  },
  insights: { connection_string: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING },
  timeout: {
    open_weather_map: parseInt(process.env.OPEN_WEATHER_MAP_TIMEOUT ?? '2000'),
    users_timeout: 2000,
  },
  circuit_breakers: {
    open_weather_map: {
      failure_threshold: parseInt(process.env.OPEN_WEATHER_MAP_CB_THRESHOLD ?? '10'),
      reset_timeouts: parseInt(process.env.OPEN_WEATHER_MAP_CB_TIMEOUT ?? `${2 * 60 * 1000}`),
    },
  },
  open_telemetry: {
    protocol:
      { 'http/protobuf': 'proto', 'http/json': 'http', grpc: 'grpc' }[
        process.env.OTEL_EXPORTER_OTLP_PROTOCOL ?? 'http/protobuf'
      ] ?? 'proto',
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
