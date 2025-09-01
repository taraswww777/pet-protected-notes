export interface EncryptedData {
  iv: ArrayBuffer;
  ciphertext: ArrayBuffer;
  authTag?: ArrayBuffer; // Для AES-GCM authTag включается в ciphertext
}

export interface EncryptionResult {
  encryptedData: ArrayBuffer; // IV + ciphertext + authTag
  encryptedDataBase64: string;
}

class CryptoService {
  private cachedMasterKey: CryptoKey | null = null;

  /**
   * Деривация Master Key из пароля и соли пользователя
   */
  async deriveMasterKey(password: string, userSalt: string): Promise<CryptoKey> {
    // Преобразуем пароль и соль в ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = this.base64ToArrayBuffer(userSalt);

    // Импортируем пароль как сырой ключ для PBKDF2
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey'],
    );

    // Деривируем Master Key используя PBKDF2
    const masterKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000,
        hash: 'SHA-256',
      },
      importedKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable должен быть true для экспорта/импорта DEK
      ['encrypt', 'decrypt'],
    );

    this.cachedMasterKey = masterKey;
    return masterKey;
  }

  /**
   * Генерация случайного DEK (Data Encryption Key) для каждой заметки
   */
  async generateDataEncryptionKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable должен быть true для экспорта
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Шифрование DEK с помощью Master Key
   */
  async encryptKey(dataKey: CryptoKey, masterKey: CryptoKey): Promise<ArrayBuffer> {
    // Экспортируем DEK в сыром формате
    const exportedKey = await window.crypto.subtle.exportKey('raw', dataKey);

    // Шифруем экспортированный DEK с помощью Master Key
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedKey = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      masterKey,
      exportedKey,
    );

    // Конкатенируем IV и зашифрованный ключ
    const result = new Uint8Array(iv.length + encryptedKey.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedKey), iv.length);

    return result;
  }

  /**
   * Расшифровка DEK с помощью Master Key
   */
  async decryptKey(encryptedKey: ArrayBuffer, masterKey: CryptoKey): Promise<CryptoKey> {
    // Извлекаем IV (первые 12 байт)
    const iv = encryptedKey.slice(0, 12);
    const actualEncryptedKey = encryptedKey.slice(12);

    // Расшифровываем ключ
    const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      masterKey,
      actualEncryptedKey,
    );

    // Импортируем расшифрованный ключ обратно в CryptoKey
    return await window.crypto.subtle.importKey(
      'raw',
      decryptedKeyBuffer,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Получение закэшированного Master Key
   */
  getCachedMasterKey(): CryptoKey | null {
    return this.cachedMasterKey;
  }

  /**
   * Очистка кэша Master Key
   */
  clearMasterKeyCache(): void {
    this.cachedMasterKey = null;
  }

  /**
   * Вспомогательная функция: base64 в ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Вспомогательная функция: ArrayBuffer в base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

}

// Экспортируем singleton instance
export const cryptoService = new CryptoService();
