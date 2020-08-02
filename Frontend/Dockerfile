FROM node:10.16-slim as builder
WORKDIR /front
ADD . /front/
RUN npm install
RUN npm run build

FROM nginx:1.19.0
COPY --from=builder /front/public /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80