FROM node:18-slim AS build

USER node

WORKDIR /opt/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-slim AS final

ENV NODE_ENV production

WORKDIR /opt/app

COPY --chown=node:node --from=build /opt/app/package*.json ./
COPY --chown=node:node --from=build /opt/app/dist ./dist

RUN npm prune --production

CMD ["node", "./dist/main.js"]