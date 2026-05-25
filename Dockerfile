# Build stage
FROM node:24.15.0-alpine AS build
WORKDIR /usr/src/app

# Install dependencies and build project
COPY package*.json tsconfig*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Production stage
FROM node:24.15.0-alpine AS production
WORKDIR /usr/src/app

# Get image arguments and set build environment variables
ARG SELF_VERSION="-"
ENV NODE_ENV=production
ENV SELF_VERSION=${SELF_VERSION}

# Copy build files to production stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose port 3000 and start application
EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/main"]