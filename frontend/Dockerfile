FROM node:lts-alpine as builder

WORKDIR /app
# vite will be installed in npm global directory
RUN npm install -g vite
COPY package*.json ./
RUN  npm run build
COPY server/ server/

FROM node:lts-alpine
# copy built files from builder image to new clean node image without vite
COPY --from=builder /app /app
WORKDIR /app

USER node

CMD [ "npm", "run", "dev", "--", "--host" ]

EXPOSE 8000