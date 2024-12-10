FROM node:22.12.0-alpine3.20

WORKDIR /home/node/app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev \
    bash \
    && apk add --no-cache --virtual .build-deps \
    build-base \
    python3-dev

COPY package.json .

RUN yarn install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
