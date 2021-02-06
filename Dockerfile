FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=3100

EXPOSE 3100

RUN node -v

CMD ["npm", "run", "start"]
#CMD ["node", "index.js"]