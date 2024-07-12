FROM node:22-alpine3.19 as node

WORKDIR /server
COPY . .

RUN npm install

ENTRYPOINT ["npm", "run", "dev"]