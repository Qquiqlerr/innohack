# Запуск бэкенд-сервера с docker-compose

1. Клонируйте репозиторий
```bash
git clone https://github.com/Qquiqlerr/innohack.git
cd innohack
```
2. Перейдите в директорию backend и соберите compose файл
```bash
cd backend
docker-compose up -build 
```
3. Дождитесь развертывания приложения

Теперь сервис доступен по адресу 0.0.0.0

Swagger документация находится в корне проекта (doc.yaml)