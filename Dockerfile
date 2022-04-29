FROM node:14.19.1-alpine3.15

WORKDIR /app

RUN apk upgrade --no-cache \
    && apk add python3 \
    && apk add --no-cache --virtual .builds-deps
    && apk add --no-cache make g++

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

EXPOSE $NUXT_PORT
CMD [ "yarn", "start" ]

COPY . .

ARG ENV
ENV ENV ${ENV}
RUN yarn build \
    && apk add --no-cache ca-certificates \
    && apk del .build-deps
