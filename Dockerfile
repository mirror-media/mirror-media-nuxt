FROM node:12.16.2-alpine

ENV APP_DIR /app

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

COPY package.json $APP_DIR
COPY yarn.lock $APP_DIR
RUN yarn install

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

COPY . $APP_DIR
RUN yarn global add pm2
RUN yarn build

RUN yarn cache clean

EXPOSE 3000
CMD [ "pm2-runtime", "start", "-i", "max", "--name", "mm-nuxt", "yarn", "--", "run", "start" ]
