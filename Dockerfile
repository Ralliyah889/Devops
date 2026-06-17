# Stage 1: Build the React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built assets to Nginx default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed, or use default
# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
