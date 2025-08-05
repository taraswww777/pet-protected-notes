import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../../uiKit/Input';
import { Textarea } from '../../uiKit/Textarea.tsx';
import { NotesServiceApi } from '../../api/NotesServiceApi.ts';
import { Button, ButtonVariant } from '../../uiKit/Button';
import { NoteEditorMode } from './NoteEditor.types.ts';
import { useNotification } from '../../services/NotificationService';

interface NoteFormValues {
  title: string;
  content: string;
}


interface NoteEditorProps {
  initialValues?: NoteFormValues;
  mode: NoteEditorMode;
  noteId?: number;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  initialValues,
  mode = NoteEditorMode.create,
  noteId,
}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const isCreateMode = mode === NoteEditorMode.create;

  const onSubmit = (fv: NoteFormValues) => {
    if (isCreateMode) {
      NotesServiceApi.createNote(fv).then((newNote) => {
        showNotification(`Создана заметка: ${newNote.id}`);
        navigate(`/notes/${newNote.id}`); // Редирект после создания
      });
    } else if (noteId) {
      NotesServiceApi.updateNote(noteId, fv).then((newNote) => {
        showNotification(`Обновлена заметка: ${newNote.id}`);
        navigate(`/notes/${noteId}`); // Редирект после редактирования
      });
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
