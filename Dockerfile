FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

ARG DEFAULT_PORT=80
ENV PORT=$DEFAULT_PORT

EXPOSE $PORT

ENV NODE_ENV=production

CMD [ "npm", "run", "start" ]
