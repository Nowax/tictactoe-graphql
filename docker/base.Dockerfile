FROM node:14.1.0-alpine3.11 as tictactoe-base

WORKDIR /usr/src/app
COPY package*.json ./
EXPOSE 3000