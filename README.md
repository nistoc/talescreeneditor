# Tales Screen Editor

React-приложение для создания и редактирования интерактивных сценариев с поддержкой множественных персонажей, диалогов и ветвлений сюжета.

## 🚀 Быстрый старт

### Предварительные требования

- Windows 11
- Docker Desktop
- Node.js 18+ и npm (для локальной разработки)
- PowerShell (встроен в Windows)

### Первоначальная настройка

1. Клонируйте репозиторий или скопируйте файлы проекта
2. Откройте PowerShell **от имени администратора**
3. Перейдите в папку проекта:
   ```powershell
   cd C:\github\talescreeneditor
   ```
4. Запустите скрипт установки:
   ```powershell
   .\setup.ps1
   ```

Скрипт автоматически:
- Проверит наличие Docker и Node.js
- Создаст необходимые папки
- Установит зависимости
- Соберет Docker образы
- Создаст вспомогательные скрипты

## 📁 Структура проекта

```
talescreeneditor/
├── src/                    # Исходный код React приложения
├── public/
│   └── assets/            # Изображения сценариев
│       ├── moonlight_heist/
│       ├── crimson_masquerade/
│       └── ...
├── storage/               # Персистентные данные (будущая функция)
├── scripts/               # PowerShell скрипты управления
├── backups/              # Резервные копии
├── docker-compose.yml    # Конфигурация Docker
└── package.json          # Зависимости проекта
```

## 🛠️ PowerShell скрипты

После выполнения `setup.ps1` в папке `scripts/` появятся следующие скрипты:

### start-dev.ps1
**Назначение:** Запуск приложения в режиме разработки с hot-reload

```powershell
.\scripts\start-dev.ps1
```

- Запускает контейнер `tales-screen-editor-dev`
- Доступно по адресу: http://localhost:3000
- Изменения в коде применяются автоматически
- Для остановки нажмите `Ctrl+C`

### start-prod.ps1
**Назначение:** Запуск production версии приложения

```powershell
.\scripts\start-prod.ps1
```

- Запускает оптимизированную версию в фоновом режиме
- Доступно по адресу: http://localhost
- Использует nginx для раздачи статики
- Работает автономно без Node.js

### stop.ps1
**Назначение:** Остановка всех запущенных контейнеров

```powershell
.\scripts\stop.ps1
```

- Останавливает и удаляет все контейнеры проекта
- Данные в `storage/` сохраняются

### backup.ps1
**Назначение:** Создание резервной копии данных

```powershell
.\scripts\backup.ps1
```

- Архивирует содержимое папки `storage/`
- Сохраняет в `backups/backup_YYYY-MM-DD_HH-mm-ss.zip`
- Рекомендуется запускать регулярно

### logs.ps1
**Назначение:** Просмотр логов контейнеров

```powershell
# Просмотр логов dev контейнера
.\scripts\logs.ps1

# Просмотр логов production контейнера
.\scripts\logs.ps1 -Container tales-screen-editor-prod

# Следить за логами в реальном времени
.\scripts\logs.ps1 -Follow
```

### clean.ps1
**Назначение:** Очистка Docker ресурсов

```powershell
.\scripts\clean.ps1
```

- Останавливает контейнеры
- Удаляет Docker образы проекта
- Очищает неиспользуемые Docker ресурсы
- **Внимание:** После очистки потребуется пересборка через `docker-compose build`

## 🎮 Использование

### Режим разработки

1. Запустите development версию:
   ```powershell
   .\scripts\start-dev.ps1
   ```

2. Откройте браузер: http://localhost:3000

3. Редактируйте код в `src/` - изменения применятся автоматически

4. Остановите по завершении:
   ```powershell
   .\scripts\stop.ps1
   ```

### Production режим

1. Запустите production версию:
   ```powershell
   .\scripts\start-prod.ps1
   ```

2. Откройте браузер: http://localhost

3. Приложение работает в фоновом режиме

4. Для остановки:
   ```powershell
   .\scripts\stop.ps1
   ```

## 🔧 Дополнительные команды

### Пересборка после изменений

```powershell
# Пересобрать все образы
docker-compose build

# Пересобрать с очисткой кеша
docker-compose build --no-cache
```

### Проверка состояния

```powershell
# Список запущенных контейнеров
docker ps

# Использование ресурсов
docker stats
```

### Работа с данными

```powershell
# Создать резервную копию
.\scripts\backup.ps1

# Открыть папку storage
explorer .\storage

# Открыть папку с изображениями
explorer .\public\assets
```

## ❗ Решение проблем

### PowerShell не запускает скрипты

```powershell
# Разрешить выполнение скриптов
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Порт занят

```powershell
# Найти процесс на порту
netstat -ano | findstr :3000

# Или измените порт в docker-compose.yml
```

### Docker не запускается

1. Убедитесь, что Docker Desktop запущен
2. Проверьте, включена ли виртуализация в BIOS
3. Перезапустите Docker Desktop

## 📝 Примечания

- Папка `storage/` предназначена для будущих функций сохранения пользовательских данных
- Изображения сценариев должны находиться в `public/assets/[scenario_name]/assets/`
- Все данные UI сохраняются в localStorage браузера

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи: `.\scripts\logs.ps1`
2. Убедитесь, что Docker Desktop запущен
3. Проверьте наличие всех необходимых файлов

---

**Версия:** 0.1.0  
**Последнее обновление:** 10 Июль 2025