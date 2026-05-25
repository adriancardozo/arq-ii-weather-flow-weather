# Weather Flow - Users (Arquitectura de Software II)

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

Copy `.env.example` file and rename to `.env`.
Then complete whit environment values

```bash
SELF_VERSION=-
MONGO_URI=<mongo_uri>
DNS_SERVERS=8.8.8.8,4.4.4.4
JWT_SECRET=<jwt_secret (e.g. "Secret")>
```

Start project

```bash
npm start
```

And then go to http://localhost:3000/docs to open Swagger UI

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
```

Create a container from this image

```bash
docker run -p "3000:3000" --env-file ".env" weather-flow-weather
```

And then go to http://localhost:3000/docs to open Swagger UI
