FROM tictactoe-base AS tictactoe-prod-build
WORKDIR /usr/src/app
RUN npm ci
COPY . .
RUN npm run build

CMD npm run start