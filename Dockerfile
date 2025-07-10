# Используем многоэтапную сборку для оптимизации размера образа
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production --silent

# Копируем весь исходный код
COPY . .

# Копируем файл окружения для Docker
COPY .env.docker .env

# Собираем приложение для production
RUN npm run build

# Стадия production - используем nginx для раздачи статики
FROM nginx:alpine

# Копируем собранное приложение из предыдущей стадии
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем кастомную конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем директорию для персистентных данных
RUN mkdir -p /opt/render/project/taleseditorstoragedev

# Открываем порт 80
EXPOSE 80

# Объявляем volume для персистентных данных
VOLUME ["/opt/render/project/taleseditorstoragedev"]

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]