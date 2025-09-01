import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Input, Textarea } from '../../uiKit/form';
import { NotesServiceApi } from '../../api/NotesServiceApi.ts';
import { Button, ButtonVariant } from '../../uiKit/Button';
import { NoteEditorMode } from './NoteEditor.types.ts';
import { useNotification } from '../../services/NotificationService';
import { cryptoService } from '../../services/CryptoService.ts';
import { AuthServiceApi } from '../../api/AuthServiceApi.ts';

interface NoteFormValues {
  title: string;
  content: string;
}


interface NoteEditorProps {
  initialValues?: NoteFormValues;
  mode: NoteEditorMode;
  noteId?: number;
}

// Временная функция - нужно реализовать безопасное хранение пароля
async function getCurrentUserPassword(): Promise<string> {
  // Это временное решение! Нужно реализовать безопасное хранение пароля в памяти
  const password = sessionStorage.getItem('userPassword');
  if (!password) {
    throw new Error('Пароль не найден в сессии');
  }
  return password;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  initialValues,
  mode = NoteEditorMode.create,
  noteId,
}) => {
  const navigate = useNavigate();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const isCreateMode = mode === NoteEditorMode.create;

  const onSubmit = async (fv: NoteFormValues) => {
    try {
      // 1. Получаем Master Key
      let masterKey = cryptoService.getCachedMasterKey();
      if (!masterKey) {
        const { data } = await AuthServiceApi.getCryptoSalt();
        const password = await getCurrentUserPassword();
        masterKey = await cryptoService.deriveMasterKey(password, data.cryptoSalt);
      }

      // 2. Генерируем временный DEK
      const temporaryDek = await cryptoService.generateDataEncryptionKey();

      // 3. Шифруем содержимое временным DEK
      const encoder = new TextEncoder();
      const contentBuffer = encoder.encode(fv.content);

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        temporaryDek,
        contentBuffer,
      );

      // 4. Формируем encrypted_content
      const encryptedContentArray = new Uint8Array(iv.length + encryptedContent.byteLength);
      encryptedContentArray.set(iv, 0);
      encryptedContentArray.set(new Uint8Array(encryptedContent), iv.length);
      const encryptedContentBase64 = btoa(String.fromCharCode(...encryptedContentArray));

      // 5. Шифруем временный DEK Master Key
      const encryptedDekBuffer = await cryptoService.encryptKey(temporaryDek, masterKey);
      const encryptedDekBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedDekBuffer)));

      // 6. В зависимости от режима вызываем соответствующий API метод
      if (isCreateMode) {
        // Режим создания - создаем новую заметку
        const newNote = await NotesServiceApi.createNote({
          title: fv.title,
          encryptedContent: encryptedContentBase64,
          encryptedDek: encryptedDekBase64,
        });

        showSuccessNotification(`Создана заметка: ${newNote.id}`);
        navigate(`/notes/${newNote.id}`);
      } else if (noteId) {
        // Режим редактирования - обновляем существующую заметку
        const updatedNote = await NotesServiceApi.updateNote(noteId, {
          title: fv.title,
          encryptedContent: encryptedContentBase64,
          encryptedDek: encryptedDekBase64,
        });

        showSuccessNotification(`Обновлена заметка: ${updatedNote.id}`);
        navigate(`/notes/${noteId}`);
      }

    } catch (error) {
      console.error('Ошибка при шифровании или сохранении заметки:', error);
      showErrorNotification('Ошибка при сохранении заметки');
    }
  };


  const [formData, setFormData] = useState<NoteFormValues>({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название"
        type="text"
        name="title"
        id="title"
        placeholder="Введите название заметки"
        value={formData.title}
        onChange={handleChange}
      />

      <Textarea
        label="Содержимое"
        name="content"
        id="content"
        placeholder="Введите содержимое заметки"
        value={formData.content}
        onChange={handleChange}
      />

      <div className="flex justify-between space-x-4 pt-4 border-t border-gray-200">
        <Button
          variant={ButtonVariant.NEUTRAL}
          type="button"
          onClick={() => {
            navigate(`/notes/${noteId}`);
          }}
        >
          Отмена
        </Button>
        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
};
