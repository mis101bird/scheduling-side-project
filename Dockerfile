FROM node:carbon-alpine

# Create app directory
RUN apk update && apk add nginx

WORKDIR /app/src
COPY . /app/src
COPY .deploy/nginx.conf /etc/nginx/nginx.conf
ARG URL_ENV
ARG STRIPE_KEY
RUN mkdir /app/log
RUN NODE_ENV=development yarn
RUN rm .env
ENV URL_ENV=${URL_ENV}
ENV KAPI_URL=https://kapi${URL_ENV}.popsquare.io
ENV API_URL=https://api${URL_ENV}.popsquare.io
ENV STRIPE_KEY=${STRIPE_KEY}
RUN npm run build

EXPOSE 8000

RUN rm -rf .git
RUN rm -rf node_modules
RUN rm -rf src
RUN rm -rf public
RUN rm -rf tests
RUN mkdir -p /run/nginx

CMD nginx -c /etc/nginx/nginx.conf
