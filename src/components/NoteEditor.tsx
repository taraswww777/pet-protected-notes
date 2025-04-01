import React, { useState } from 'react';
import { FormInput } from '../uiKit/FormInput';
import { TextareaField } from '../uiKit/TextareaField';

interface NoteFormValues {
  title: string;
  content: string;
}

interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => void;
}

export const NoteEditor: React.FC<NoteFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NoteFormValues>({
    title: '',
    content: '',
  });

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
      <FormInput
        label="Название"
        type="text"
        name="title"
        id="title"
        placeholder="Введите название заметки"
        value={formData.title}
        onChange={handleChange}
      />

      <TextareaField
        label="Содержимое"
        name="content"
        id="content"
        placeholder="Введите содержимое заметки"
        value={formData.content}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Создать заметку
      </button>
    </form>
  );
};
