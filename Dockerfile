# Étape de construction de l'application
FROM node:20-alpine AS builder
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL /portfolio_api
WORKDIR /app
COPY package.json .
RUN npm install --production --ignore-scripts
COPY . .
RUN npm run build

# Étape de production
FROM node:20-alpine
USER node
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /app/.next/static .next/standalone/.next/static
COPY --from=builder /app/public ./.next/standalone/public

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]