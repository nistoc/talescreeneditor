/**
 * Утилиты для безопасной работы с localStorage
 * Включает обработку ошибок и сценарий-специфичные ключи
 */

export interface ScenarioStorageData {
  selectedScreenId: string | null;
  expandedScreens: Record<string, boolean>;
  selectedCharacterId: string | null;
  viewMode: string | null;
}

/**
 * Получает ключ localStorage для конкретного сценария
 * @param scenarioId - ID сценария
 * @param key - ключ данных
 * @returns уникальный ключ для localStorage
 */
export const getScenarioStorageKey = (scenarioId: string, key: string): string => {
  return `scenario_${scenarioId}_${key}`;
};

/**
 * Безопасное получение данных из localStorage
 * @param key - ключ данных
 * @returns значение или null при ошибке
 */
export const getFromStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
};

/**
 * Безопасное сохранение данных в localStorage
 * @param key - ключ данных
 * @param value - значение для сохранения
 */
export const saveToStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

/**
 * Безопасное удаление данных из localStorage
 * @param key - ключ данных
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

/**
 * Получает данные сценария из localStorage
 * @param scenarioId - ID сценария
 * @returns объект с данными сценария
 */
export const getScenarioData = (scenarioId: string): ScenarioStorageData => {
  if (!scenarioId) {
    return {
      selectedScreenId: null,
      expandedScreens: {},
      selectedCharacterId: null,
      viewMode: null,
    };
  }

  const selectedScreenId = getFromStorage(getScenarioStorageKey(scenarioId, 'selectedScreenId'));
  
  let expandedScreens: Record<string, boolean> = {};
  const expandedScreensData = getFromStorage(getScenarioStorageKey(scenarioId, 'expandedScreens'));
  if (expandedScreensData) {
    try {
      expandedScreens = JSON.parse(expandedScreensData);
    } catch (error) {
      console.warn('Failed to parse expandedScreens from localStorage:', error);
      expandedScreens = {};
    }
  }

  const selectedCharacterId = getFromStorage(getScenarioStorageKey(scenarioId, 'selectedCharacterId'));
  const viewMode = getFromStorage(getScenarioStorageKey(scenarioId, 'viewMode'));

  return {
    selectedScreenId,
    expandedScreens,
    selectedCharacterId,
    viewMode,
  };
};

/**
 * Сохраняет выбранный экран для сценария
 * @param scenarioId - ID сценария
 * @param screenId - ID экрана или null для очистки
 */
export const saveSelectedScreenId = (scenarioId: string, screenId: string | null): void => {
  if (!scenarioId) return;
  
  const key = getScenarioStorageKey(scenarioId, 'selectedScreenId');
  if (screenId) {
    saveToStorage(key, screenId);
  } else {
    removeFromStorage(key);
  }
};

/**
 * Сохраняет развернутые экраны для сценария
 * @param scenarioId - ID сценария
 * @param expandedScreens - объект с состоянием развернутых экранов
 */
export const saveExpandedScreens = (scenarioId: string, expandedScreens: Record<string, boolean>): void => {
  if (!scenarioId) return;
  
  const key = getScenarioStorageKey(scenarioId, 'expandedScreens');
  saveToStorage(key, JSON.stringify(expandedScreens));
};

/**
 * Сохраняет выбранный viewMode для сценария
 * @param scenarioId - ID сценария
 * @param viewMode - viewMode или null для очистки
 */
export const saveViewMode = (scenarioId: string, viewMode: string | null): void => {
  if (!scenarioId) return;

  const key = getScenarioStorageKey(scenarioId, 'viewMode');
  if (viewMode) {
    saveToStorage(key, viewMode);
  } else {
    removeFromStorage(key);
  }
};

/**
 * Сохраняет выбранного персонажа для сценария
 * @param scenarioId - ID сценария
 * @param characterId - ID персонажа или null для очистки
 */
export const saveSelectedCharacterId = (scenarioId: string, characterId: string | null): void => {
  if (!scenarioId) return;
  
  const key = getScenarioStorageKey(scenarioId, 'selectedCharacterId');
  if (characterId) {
    saveToStorage(key, characterId);
  } else {
    removeFromStorage(key);
  }
};

/**
 * Очищает все данные для конкретного сценария
 * @param scenarioId - ID сценария
 */
export const clearScenarioData = (scenarioId: string): void => {
  if (!scenarioId) return;
  
  const keys = ['selectedScreenId', 'expandedScreens', 'selectedCharacterId', 'viewMode'];
  keys.forEach(key => {
    removeFromStorage(getScenarioStorageKey(scenarioId, key));
  });
};

/**
 * Получает список всех ключей localStorage для конкретного сценария
 * @param scenarioId - ID сценария
 * @returns массив ключей
 */
export const getScenarioStorageKeys = (scenarioId: string): string[] => {
  if (!scenarioId) return [];
  
  try {
    const allKeys = Object.keys(localStorage);
    const prefix = `scenario_${scenarioId}_`;
    return allKeys.filter(key => key.startsWith(prefix));
  } catch (error) {
    console.warn('Failed to get scenario storage keys:', error);
    return [];
  }
};

/**
 * Проверяет доступность localStorage
 * @returns true если localStorage доступен
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}; 