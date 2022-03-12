# Base required for most things
FROM node:17.3.0 as base

WORKDIR /opt/app

RUN apt-get update >/dev/null && \
    apt-get install -y --no-install-recommends build-essential python dumb-init >/dev/null && \
    apt-get clean >/dev/null && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["dumb-init", "--"]

# Development, used for development only (defaults to watch command)
FROM base as development

CMD [ "npm", "run", "docker:watch"]

# Build stage for production
FROM base as build

COPY ./package.json yarn.lock /opt/app/

RUN SKIP_POSTINSTALL=1 yarn install >/dev/null

COPY . /opt/app

RUN yarn build:production >/dev/null

# Production image used to  run the bot in production, only contains node_modules & dist contents.
FROM base as production

ENV NODE_ENV production

COPY --from=build /opt/app/dist /opt/app/dist
COPY --from=build /opt/app/package.json /opt/app/package.json
RUN SKIP_POSTINSTALL=1 yarn install --production >/dev/null

CMD ["node", "."]
