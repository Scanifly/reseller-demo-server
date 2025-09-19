# Base stage: install dependencies and build
FROM node:20-alpine AS base

WORKDIR /reseller-demo-server

# Copy only necessary files for caching
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./.yarnrc.yml
COPY --chown=node:node package.json yarn.lock tsconfig.json tsoa.json ./

# Install dependencies
RUN corepack enable && corepack prepare yarn@3.6.4 --activate && yarn set version 3.6.4
RUN yarn --frozen-lockfile --network-timeout 600000

# Copy application source code
COPY --chown=node:node ./app ./app

COPY --chown=node:node ./tsoa.json ./dist/tsoa.json
COPY --chown=node:node ./app/routes/swagger.json ./dist/app/routes/swagger.json

# Remove dev dependencies
ENV YARN_ENABLE_SCRIPTS=false
RUN yarn build
RUN yarn build:prod

# Runtime stage: api
FROM base AS api
USER node
EXPOSE 3001
CMD ["node", ".yarn/releases/yarn-3.6.4.cjs", "start"]
