FROM tictactoe-base AS tictactoe-dev
WORKDIR /usr/src/app
RUN npm install
COPY . .
CMD npm run docker:dev:start
