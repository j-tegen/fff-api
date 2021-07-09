FROM node:12-alpine

WORKDIR /var/www/app

RUN yarn global add nodemon

COPY package.json .
COPY yarn.lock .
COPY entrypoint.sh .
COPY wait-for.sh .

RUN yarn install --quiet

COPY nodemon.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

COPY ./src ./src
COPY ./client ./client

EXPOSE 8090