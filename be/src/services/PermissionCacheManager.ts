/**
 * Менеджер кэширования разрешений пользователей
 *
 * Реализует паттерн Singleton для глобального доступа к кэшу разрешений.
 * Обеспечивает временное хранение результатов проверки прав доступа с
 * возможностью настройки времени жизни и ограничения размера кэша.
 */
export class PermissionCacheManager {
  private static instance: PermissionCacheManager;

  /**
   * Основное хранилище кэша
   *
   * Структура: userId -> Map<actionCode, isAllowed>
   * Где:
   * - userId: number - идентификатор пользователя
   * - actionCode: string - код действия/разрешения
   * - isAllowed: boolean - разрешено ли действие
   */
  private cache = new Map<number, Map<string, boolean>>();

  /**
   * Хранилище времени жизни записей кэша
   *
   * Структура: userId -> Map<actionCode, expiryTimestamp>
   * Где expiryTimestamp: number - timestamp (мс) когда запись станет невалидной
   */
  private cacheExpiry = new Map<number, Map<string, number>>();

  /** Максимальное количество пользователей в кэше (по умолчанию: 1000) */
  private maxSize: number = 1000;

  /** Время жизни записей по умолчанию в миллисекундах (5 минут) */
  private defaultTTL: number = 5 * 60 * 1000;

  /**
   * Статистика использования кэша
   *
   * Содержит счетчики для мониторинга эффективности кэширования:
   * - hits: number - количество успешных попаданий в кэш
   * - misses: number - количество промахов кэша (данные не найдены или устарели)
   * - evictions: number - количество вытесненных записей из-за превышения лимита
   */
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  /** Приватный конструктор для реализации паттерна Singleton */
  private constructor() {}

  /**
   * Получить экземпляр PermissionCacheManager (Singleton)
   *
   * @returns Единственный экземпляр менеджера кэша
   */
  static getInstance(): PermissionCacheManager {
    if (!PermissionCacheManager.instance) {
      PermissionCacheManager.instance = new PermissionCacheManager();
    }
    return PermissionCacheManager.instance;
  }

  /**
   * Получить все разрешения пользователя из кэша
   *
   * @param userId - ID пользователя
   * @returns Map с разрешениями или undefined если не найдено
   */
  getPermissionsByUserId(userId: number): Map<string, boolean> | undefined {
    return this.cache.get(userId);
  }

  /**
   * Проверить наличие разрешения в кэше
   *
   * @param userId - ID пользователя
   * @param actionCode - код действия
   * @returns true если разрешение есть в кэше (не проверяет expiry)
   */
  hasPermission(userId: number, actionCode: string): boolean {
    return Boolean(this.getPermissionsByUserId(userId)?.has(actionCode));
  }

  /**
   * Получить значение разрешения из кэша с проверкой срока действия
   *
   * @param userId - ID пользователя
   * @param actionCode - код действия
   * @returns значение разрешения или null если не найдено или устарело
   */
  getPermission(userId: number, actionCode: string): boolean | null {
    const expiryMap = this.cacheExpiry.get(userId);
    const expiryTime = expiryMap?.get(actionCode);

    // Проверяем срок действия
    if (expiryTime && Date.now() > expiryTime) {
      this.clearForUserAction(userId, actionCode);
      return null;
    }

    const hasCache = this.hasPermission(userId, actionCode);
    if (hasCache) {
      this.stats.hits++;
      return Boolean(this.getPermissionsByUserId(userId)?.get(actionCode));
    } else {
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Сохранить разрешение в кэш
   *
   * @param userId - ID пользователя
   * @param actionCode - код действия
   * @param isAllowed - разрешено ли действие
   * @param ttlMs - время жизни в миллисекундах (по умолчанию 5 минут)
   * @throws Error если переданы невалидные параметры
   */
  setPermission(userId: number, actionCode: string, isAllowed: boolean, ttlMs: number = this.defaultTTL): void {
    if (userId <= 0) throw new Error('Invalid user ID');
    if (!actionCode || typeof actionCode !== 'string') throw new Error('Invalid action code');
    if (ttlMs <= 0) throw new Error('TTL must be positive');

    // Проверяем лимит памяти
    if (this.cache.size >= this.maxSize && !this.cache.has(userId)) {
      this.evictOldest();
    }

    if (!this.cache.has(userId)) {
      this.cache.set(userId, new Map<string, boolean>());
    }

    if (!this.cacheExpiry.has(userId)) {
      this.cacheExpiry.set(userId, new Map<string, number>());
    }

    this.cache.get(userId)!.set(actionCode, isAllowed);
    this.cacheExpiry.get(userId)!.set(actionCode, Date.now() + ttlMs);
  }

  /**
   * Массовое сохранение разрешений пользователя
   *
   * @param userId - ID пользователя
   * @param permissions - объект с разрешениями
   * @param ttlMs - время жизни в миллисекундах
   */
  setPermissions(userId: number, permissions: Record<string, boolean>, ttlMs: number = this.defaultTTL): void {
    Object.entries(permissions).forEach(([actionCode, isAllowed]) => {
      this.setPermission(userId, actionCode, isAllowed, ttlMs);
    });
  }

  /**
   * Удалить все разрешения пользователя
   *
   * @param userId - ID пользователя
   * @returns true если пользователь был в кэше
   */
  delete(userId: number): boolean {
    this.cacheExpiry.delete(userId);
    return this.cache.delete(userId);
  }

  /**
   * Полностью очистить кэш
   */
  clear(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    this.resetStats();
  }

  /**
   * Очистить кэш для конкретного пользователя
   *
   * @param userId - ID пользователя
   */
  clearForUser(userId: number): void {
    this.cacheExpiry.delete(userId);
    this.cache.delete(userId);
  }

  /**
   * Очистить конкретное разрешение у пользователя
   *
   * @param userId - ID пользователя
   * @param actionCode - код действия
   */
  clearForUserAction(userId: number, actionCode: string): void {
    this.getPermissionsByUserId(userId)?.delete(actionCode);
    this.cacheExpiry.get(userId)?.delete(actionCode);
  }

  /**
   * Очистить конкретные action codes у всех пользователей
   *
   * @param actionCodeList - массив кодов действий
   */
  clearPermissionByActionCode(actionCodeList: string[]): void {
    this.cache.forEach((userCache) => {
      actionCodeList.forEach((actionCode) => {
        userCache.delete(actionCode);
      });
    });

    this.cacheExpiry.forEach((expiryMap) => {
      actionCodeList.forEach((actionCode) => {
        expiryMap.delete(actionCode);
      });
    });
  }

  /**
   * Очистить все разрешения для конкретного action code
   *
   * @param actionCode - код действия
   */
  clearAllForActionCode(actionCode: string): void {
    this.cache.forEach(userCache => {
      userCache.delete(actionCode);
    });

    this.cacheExpiry.forEach(expiryMap => {
      expiryMap.delete(actionCode);
    });
  }

  /**
   * Получить статистику использования кэша
   *
   * @returns объект со статистикой
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      userCount: this.cache.size,
      totalEntries: Array.from(this.cache.values()).reduce((sum, userCache) => sum + userCache.size, 0)
    };
  }

  /**
   * Сбросить статистику использования
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * Очистить просроченные записи в кэше
   *
   * @returns количество удаленных записей
   */
  cleanupExpired(): number {
    let cleaned = 0;
    const now = Date.now();

    this.cacheExpiry.forEach((expiryMap, userId) => {
      expiryMap.forEach((expiryTime, actionCode) => {
        if (now > expiryTime) {
          this.clearForUserAction(userId, actionCode);
          cleaned++;
        }
      });
    });

    return cleaned;
  }

  /**
   * Установить максимальный размер кэша
   *
   * @param maxSize - максимальное количество пользователей
   */
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
  }

  /**
   * Установить время жизни по умолчанию
   *
   * @param ttlMs - время в миллисекундах
   */
  setDefaultTTL(ttlMs: number): void {
    this.defaultTTL = ttlMs;
  }

  /**
   * Удалить самые старые записи при превышении лимита
   */
  private evictOldest(): void {
    const oldestUserId = Array.from(this.cache.keys())[0];
    this.delete(oldestUserId);
    this.stats.evictions++;
  }
}
