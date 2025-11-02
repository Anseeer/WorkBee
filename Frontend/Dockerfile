# Stage 1 - Build the app
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the files including env
COPY . .

# ✅ Copy your env file (make sure it exists inside Frontend/)
# This ensures Vite/React gets correct URLs during build
COPY ./Frontend/.env.production .env

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
