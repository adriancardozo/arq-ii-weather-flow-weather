# Weather Flow - Weather (Arquitectura de Software II)

## Start project locally

Install system dependencies:

[Node.js Installation](https://nodejs.org/en/download)

Install dependencies:

```bash
npm install
```

Install development hooks:

```bash
npm run prepare
```

<blockquote>
<b>NOTE</b>
<p>This project uses an Azure Service Bus queue. You can start Azure Service Bus Emulator by running following command:</p>
<pre>docker compose -f "docker-compose.yml" up</pre>
<p>And using following connection string:</p>
<pre>Endpoint=sb://localhost:5672;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;</pre>
<p>Also you can use <a href="https://www.messentra.com/#download">Messentra</a> configuring following connection string to administrate emulator queues:</p>
<pre>Endpoint=sb://localhost:5300;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;</pre>
</blockquote>

Copy `.env.example` file and rename to `.env`.
Then complete whit environment values

```bash
SELF_VERSION=-
MONGO_URI=<mongo_uri>
DNS_SERVERS=8.8.8.8,4.4.4.4
JWT_SECRET=<jwt_secret (e.g. "Secret")>
SERVICE_BUS_CONNECTION_STRING=<service_bus_connection_string>
USERS_URL=<users_url>
PORT=3001
OPEN_WEATHER_MAP_URL=<open_weather_map_url>
OPEN_WEATHER_MAP_KEY=<open_weather_map_key>
REDIS_CACHE_URL=<redis_cache_url (optional)>
REDIS_CACHE_CONNECTION_TIMEOUT=<redis_cache_connection_timeout (default: 2000)>
CACHE_DISABLED=<cache_disabled (default: false)>
```

Start project

```bash
npm start
```

And then go to http://localhost:3001/docs to open Swagger UI

## Start backend project using docker

Build image using the following command

```bash
docker build --pull --rm -f 'Dockerfile' -t 'weather-flow-weather:latest' '.'
```

Copy `.env.example` file and rename to `.env`.
Then complete whit environment values

```bash
SELF_VERSION=-
MONGO_URI=<mongo_uri>
DNS_SERVERS=8.8.8.8,4.4.4.4
JWT_SECRET=<jwt_secret (e.g. "Secret")>
SERVICE_BUS_CONNECTION_STRING=<service_bus_connection_string>
USERS_URL=<users_url>
PORT=3001
OPEN_WEATHER_MAP_URL=<open_weather_map_url>
OPEN_WEATHER_MAP_KEY=<open_weather_map_key>
REDIS_CACHE_URL=<redis_cache_url (optional)>
REDIS_CACHE_CONNECTION_TIMEOUT=<redis_cache_connection_timeout (default: 2000)>
CACHE_DISABLED=<cache_disabled (default: false)>
```

Create a container from this image

```bash
docker run -p "3001:3001" --env-file ".env" weather-flow-weather
```

And then go to http://localhost:3001/docs to open Swagger UI
