// EXAMPLE_USAGE.ts
// Этот файл демонстрирует, как может использоваться папка storage в будущем
// This file demonstrates potential future usage of the storage directory

import path from 'path';
import { Scenario } from '../src/types/api.scenarios';

// ===== Backend (Node.js/Express) =====

// Пример API endpoint для сохранения сценария
app.post('/api/scenarios/:id/save', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.session; // После добавления аутентификации
  const scenarioData: Scenario = req.body;
  
  // Путь к файлу в storage
  const filePath = path.join(
    process.env.STORAGE_PATH,
    'user-data',
    userId,
    'scenarios',
    `${id}.json`
  );
  
  try {
    // Создать директории если не существуют
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Сохранить данные
    await fs.writeFile(filePath, JSON.stringify(scenarioData, null, 2));
    
    // Создать резервную копию
    const backupPath = filePath.replace('.json', `_backup_${Date.now()}.json`);
    await fs.copyFile(filePath, backupPath);
    
    res.json({ 
      success: true, 
      message: 'Scenario saved successfully',
      path: filePath 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Пример endpoint для загрузки изображений
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  const { userId } = req.session;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Сохранить в storage/user-assets
  const targetPath = path.join(
    process.env.STORAGE_PATH,
    'user-assets',
    userId,
    'uploads',
    `${Date.now()}_${file.originalname}`
  );
  
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.rename(file.path, targetPath);
  
  res.json({
    success: true,
    url: `/storage/user-assets/${userId}/uploads/${path.basename(targetPath)}`
  });
});

// ===== Frontend (React) =====

// src/services/storageService.ts
export class StorageService {
  // Сохранить изменения сценария
  static async saveScenario(scenarioId: string, data: Scenario): Promise<void> {
    const response = await fetch(`/api/scenarios/${scenarioId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save scenario');
    }
  }
  
  // Загрузить пользовательское изображение
  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.url;
  }
  
  // Экспортировать сценарий
  static async exportScenario(scenarioId: string): Promise<Blob> {
    const response = await fetch(`/api/scenarios/${scenarioId}/export`);
    return response.blob();
  }
  
  // Получить историю версий
  static async getVersionHistory(scenarioId: string): Promise<Version[]> {
    const response = await fetch(`/api/scenarios/${scenarioId}/versions`);
    return response.json();
  }
}

// src/hooks/useAutoSave.ts
export function useAutoSave(scenarioId: string, data: Scenario) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (!data) return;
      
      setIsSaving(true);
      try {
        await StorageService.saveScenario(scenarioId, data);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 30000); // Автосохранение каждые 30 секунд
    
    return () => clearInterval(saveInterval);
  }, [scenarioId, data]);
  
  return { isSaving, lastSaved };
}

// ===== Структура данных в storage =====

interface StorageStructure {
  'user-data': {
    [userId: string]: {
      scenarios: {
        [scenarioId: string]: Scenario;
      };
      profile: {
        preferences: UserPreferences;
        settings: UserSettings;
      };
      progress: {
        [scenarioId: string]: {
          currentScreenId: string;
          choices: Choice[];
          achievements: Achievement[];
        };
      };
    };
  };
  'user-assets': {
    [userId: string]: {
      uploads: {
        // Загруженные пользователем изображения
        [filename: string]: Buffer;
      };
    };
  };
  'exports': {
    [date: string]: {
      [scenarioId: string]: Scenario;
    };
  };
  'temp': {
    // Временные файлы для обработки
  };
}