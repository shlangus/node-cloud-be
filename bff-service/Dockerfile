# LTS
FROM node:14.17.6-alpine AS base

WORKDIR app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

#####
FROM node:14.17.6-alpine AS app

WORKDIR app

# Doing this here so that it makes npm ci installing only prod deps
ENV NODE_ENV=production

COPY --from=base /app/.env ./
COPY --from=base /app/package*.json ./
RUN npm ci --audit=false
# /dist changes more often comparing to package* and node_modules
COPY --from=base /app/dist ./dist

USER node
EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]
