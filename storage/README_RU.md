# Документация директории Storage

## Текущий статус
**⚠️ Эта директория в данный момент НЕ используется приложением.**

Приложение сейчас хранит все пользовательские настройки и состояние UI в localStorage браузера. Папка `storage` - это заготовка для будущих функций постоянного хранения данных.

## Назначение и концепция

Эта директория предназначена для хранения динамических пользовательских данных, которые должны сохраняться при перезапуске и обновлении контейнера.

### Ключевые отличия от других директорий

| Директория | Назначение | Тип контента | Сохранность |
|------------|------------|--------------|-------------|
| `/public/assets/` | Статические изображения сценариев | Только чтение | Часть Docker образа |
| `/src/types/defaults/` | JSON данные сценариев по умолчанию | Только чтение | Часть Docker образа |
| `/storage/` | Пользовательские данные | Чтение/запись | Docker volume (переживает обновления) |

## Планируемые сценарии использования

### 1. Модифицированные пользователем сценарии
```
storage/
├── scenarios/
│   ├── moonlight_heist_modified.json
│   ├── custom_user_scenario.json
│   └── drafts/
│       └── work_in_progress.json
```

### 2. Загруженные пользователем изображения
```
storage/
├── user-assets/
│   ├── {userId}/
│   │   ├── characters/
│   │   │   └── custom_character.webp
│   │   └── backgrounds/
│   │       └── uploaded_scene.jpg
```

### 3. Функции экспорта/импорта
```
storage/
├── exports/
│   ├── scenario_export_2025-01-10.json
│   └── full_backup_2025-01-10.zip
├── imports/
│   └── processing/
│       └── temp_import.json
```

### 4. Версионирование и резервные копии
```
storage/
├── versions/
│   ├── moonlight_heist/
│   │   ├── v1_2025-01-10_10-30.json
│   │   ├── v2_2025-01-10_14-45.json
│   │   └── current.json
```

### 5. Пользовательские сессии и прогресс
```
storage/
├── sessions/
│   ├── user_{userId}/
│   │   ├── progress.json
│   │   ├── choices_history.json
│   │   └── achievements.json
```

## Техническая реализация

### Конфигурация Docker Volume

**docker-compose.yml:**
```yaml
volumes:
  - ./storage:/opt/render/project/taleseditorstoragedev
```

Это создает связь между:
- Хост: `C:\Projects\tales-screen-editor\storage` (Windows)
- Контейнер: `/opt/render/project/taleseditorstoragedev`

### Переменная окружения
```env
REACT_APP_STORAGE_PATH=/opt/render/project/taleseditorstoragedev
```

### Почему такой путь?
Путь `/opt/render/project/taleseditorstoragedev` используется для совместимости с платформой развертывания Render.com (см. `render.yaml`).

## Для будущих разработчиков

### Добавление функций хранения

1. **Создайте API endpoints** для файловых операций:
   ```typescript
   // Пример: Endpoint для сохранения сценария
   app.post('/api/scenarios/:id/save', async (req, res) => {
     const { id } = req.params;
     const scenarioData = req.body;
     const filePath = path.join(STORAGE_PATH, 'scenarios', `${id}.json`);
     await fs.writeFile(filePath, JSON.stringify(scenarioData));
     res.json({ success: true });
   });
   ```

2. **Добавьте сервис хранения** в React:
   ```typescript
   // src/services/storageService.ts
   export const storageService = {
     saveScenario: async (id: string, data: Scenario) => {
       return fetch(`/api/scenarios/${id}/save`, {
         method: 'POST',
         body: JSON.stringify(data)
       });
     },
     loadScenario: async (id: string) => {
       return fetch(`/api/scenarios/${id}/load`);
     }
   };
   ```

3. **Управление правами доступа**:
   - Обеспечьте правильные права доступа к файлам в Docker
   - Реализуйте контроль доступа на основе пользователей
   - Валидируйте загружаемые файлы

### Лучшие практики

1. **Структура**: Организуйте данные по ID пользователя
2. **Очистка**: Реализуйте регулярную очистку временных файлов
3. **Лимиты**: Установите квоты хранения для пользователей
4. **Резервное копирование**: Реализуйте автоматическое резервное копирование
5. **Безопасность**: Никогда не храните конфиденциальные данные без шифрования

### Тестирование функций хранения

```bash
# Тест записи из контейнера
docker exec tales-screen-editor-prod \
  sh -c "echo 'test' > /opt/render/project/taleseditorstoragedev/test.txt"

# Проверка на хосте
cat ./storage/test.txt

# Тест сохранности данных
docker-compose restart tales-screen-editor
docker exec tales-screen-editor-prod \
  cat /opt/render/project/taleseditorstoragedev/test.txt
```

## План миграции

При реализации функций хранения:

1. **Фаза 1**: Добавить API endpoints для чтения/записи
2. **Фаза 2**: Мигрировать данные из localStorage в файловое хранилище
3. **Фаза 3**: Реализовать аутентификацию пользователей
4. **Фаза 4**: Добавить управление квотами
5. **Фаза 5**: Включить синхронизацию между устройствами

## Важные замечания

- ✅ Структура директорий готова для Docker
- ✅ Volume mounting настроен
- ✅ Данные сохраняются при обновлении контейнера
- ❌ Нет текущей реализации чтения/записи
- ❌ API endpoints еще не существуют
- ❌ Frontend использует только localStorage

## Вопросы или проблемы?

При реализации функций хранения учитывайте:
- Аутентификацию и авторизацию пользователей
- Ограничения размера файлов и валидацию
- Процедуры резервного копирования и восстановления
- Соответствие GDPR для пользовательских данных
- Кроссплатформенную совместимость путей

---
*Последнее обновление: Январь 2025*  
*Статус: Заготовка для будущей реализации*