FROM node:22 AS builder

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./fe/package.json ./fe/
COPY ./be/package.json ./be/

# Устанавливаем зависимости
RUN npm ci

COPY . .

RUN npm run fe:build


FROM nginx:1.25-alpine3.18 AS runtime

RUN mkdir /static && chown -R nginx:nginx /static && \
  ln -sf /dev/stdout /var/log/nginx/access.log && \
  ln -sf /dev/stderr /var/log/nginx/error.log

COPY ./fe/mime.types /etc/nginx/mime.types

COPY ./fe/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/fe/dist /static/


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
