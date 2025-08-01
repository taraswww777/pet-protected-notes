# Используем официальный образ Node.js
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

RUN mkdir fe
RUN mkdir be

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./fe/package.json ./fe
COPY ./be/package.json ./be

# Устанавливаем зависимости
RUN npm ci


# TODO: env тут класть это плохо надо чтото с этим сделать
#COPY ./.env.example ./.env

# Копируем все файлы приложения
COPY . .

# Пока проект меньше 100К строк кода, разници нет
RUN npm run be:build

CMD ["sh", "-c", "npm run be:db:migrate && npm run be:start"]

EXPOSE 80
