# Gunakan image Node.js untuk build tahap awal
FROM node:20 AS builder

WORKDIR /app

# Copy package.json dan install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy semua kode ke dalam container
COPY . .

# Build aplikasi
RUN npm run build

# Gunakan image Nginx untuk serving frontend
FROM nginx:latest

# Copy build hasil React ke dalam Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: replace default nginx.conf kalau perlu custom config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 untuk akses
EXPOSE 80