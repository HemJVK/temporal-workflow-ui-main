FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
