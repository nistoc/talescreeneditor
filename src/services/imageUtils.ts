// Кэш для хранения доступных серверов для каждого scenarioId
const serverCache = new Map<string, string>();

// Список всех возможных серверов

// Если нужна поддержка переменных окружения
const getServers = () => {
  const baseServers = ['/assets'];
  
  // Добавляем внешние серверы только если приложение имеет доступ к интернету
  if (process.env.REACT_APP_ENABLE_EXTERNAL_ASSETS !== 'false') {
    baseServers.push(
      'http://screen-editor-dev.onrender.com/projects',
      'http://screen-editor-prep.onrender.com/projects'
    );
  }
  
  return baseServers;
};

export async function getScenarioImageUrl(scenarioId: string, imageName: string): Promise<string | null> {
  const servers = getServers();
  // Проверяем, есть ли в кэше рабочий сервер для этого scenarioId
  const cachedServer = serverCache.get(scenarioId);
  if (cachedServer) {
    return `${cachedServer}/${scenarioId}/assets/${imageName}`;
  }

  // Если нет в кэше, проверяем все серверы
  for (const server of servers) {
    const url = `${server}/${scenarioId}/assets/${imageName}`;
    try {
      const imageExists = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

      if (imageExists) {
        // Сохраняем рабочий сервер в кэш
        serverCache.set(scenarioId, server);
        return url;
      }
    } catch (e) {
      // continue to next server
    }
  }

  return null;
} 