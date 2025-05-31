# Build stage
FROM node:22 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with static file server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace default NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf