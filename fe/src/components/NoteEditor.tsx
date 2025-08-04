import React, { useEffect, useState } from 'react';
import { Input } from '../uiKit/Input';
import { Textarea } from '../uiKit/Textarea.tsx';

interface NoteFormValues {
  title: string;
  content: string;
}

interface NoteEditorProps {
  initialValues?: NoteFormValues;
  onSubmit: (values: NoteFormValues) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  initialValues,
  onSubmit,
}) => {
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Сохранить изменения
      </button>
    </form>
  );
};
