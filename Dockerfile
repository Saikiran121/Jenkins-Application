# Stage 1: Install production dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Install all dependencies and run build/tests (optional)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# In a real scenario, you might run tests here
# RUN npm test

# Stage 3: Final production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Environment placeholders for reference (Pass actual values at runtime!)
ENV MONGO_USER=userPlaceholder
ENV MONGO_PASS=passwordPlaceholder
ENV MONGO_HOST=localhost:27017
ENV MONGO_DB=deepsea

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
