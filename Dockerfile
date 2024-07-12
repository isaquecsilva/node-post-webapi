FROM node:22-alpine3.19 as node

WORKDIR /server
COPY . .

RUN rm Dockerfile compose.yml

ENTRYPOINT ["npm", "run", "dev"]