FROM node:18-slim

RUN apt update
RUN apt install -y dumb-init

COPY package.json .
COPY package-lock.json .
RUN npm i

COPY index.js .

USER node
CMD ["dumb-init", "node", "--expose-gc", "."]
