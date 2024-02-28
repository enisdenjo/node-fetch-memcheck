FROM node:21-slim

RUN apt update
RUN apt install -y dumb-init

COPY package.json .
COPY package-lock.json .
RUN npm i

COPY index.js .

# allow self-signed certificates
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

USER node
CMD ["dumb-init", "node", "--expose-gc", "."]
