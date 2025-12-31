FROM node:18-alpine
WORKDIR /app

# Copy backend and frontend
COPY backend/package.json backend/package-lock.json* ./backend/
COPY backend ./backend
COPY frontend ./frontend

# Install backend dependencies
RUN cd backend && npm install --production

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "backend/index.js"]