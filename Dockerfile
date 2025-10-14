# 1️⃣ Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Vite project
RUN npm run build

# 2️⃣ Production stage - Serve with Nginx
FROM nginx:alpine

# Copy built files from build stage to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx.conf with our custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
