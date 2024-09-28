FROM node:lts-alpine as builder

WORKDIR /app
# vite will be installed in npm global directory
RUN npm install -g vite
COPY package*.json ./
COPY client/package*.json client/
RUN npm run install-client --omit=dev
COPY server/package*.json server/
RUN npm run install-server --omit=dev
COPY client/ client/
RUN  npm run build
COPY server/ server/

FROM node:lts-alpine
# copy built files from builder image to new clean node image without vite
COPY --from=builder /app /app
WORKDIR /app

USER node

CMD [ "npm", "run", "dev", "--", "--host" ]

EXPOSE 8000