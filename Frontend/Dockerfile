FROM node:10-alpine3.9 as builder
WORKDIR /front
ADD . /front/
RUN npm install --unsafe-perm
RUN npm run build

FROM nginx:1.19.0
COPY --from=builder /front/public /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80