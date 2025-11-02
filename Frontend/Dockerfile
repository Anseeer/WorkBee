# Stage 1 - Build the app
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci
# Copy source and env files
COPY . .
COPY .env.production .env

# Build the production version
RUN npm run build

# Stage 2 - NGINX to serve static files
FROM nginx:alpine

# Copy build output to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Default nginx config
COPY nginx.config /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
