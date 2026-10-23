FROM node:24-alpine

WORKDIR /app

RUN apk upgrade --no-cache \
    && apk add python3 \
    && apk add --no-cache --virtual .builds-deps make g++

COPY package.json .
COPY yarn.lock .
COPY patches ./patches
RUN yarn install --frozen-lockfile --ignore-engines

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

EXPOSE $NUXT_PORT
CMD [ "yarn", "start" ]

COPY . .

ARG ENV
ENV ENV ${ENV}
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build && apk add --no-cache ca-certificates
