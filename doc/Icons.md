# Иконки в проекте

## 📌 Основные ресурсы

Все иконки берутся из коллекций [Iconify](https://icon-sets.iconify.design) - это огромная библиотека иконок из
популярных наборов.

## 📦 Используемые коллекции

В проекте уже подключены три коллекции:

1. [Material Design Icons (mdi)](https://icon-sets.iconify.design/mdi/)
    - Стиль: полноцветные, толстые линии
    - Пример: `icon-[mdi--home]`

2. [Material Design Light (mdi-light)](https://icon-sets.iconify.design/mdi-light/)
    - Стиль: тонкие контурные иконки
    - Пример: `icon-[mdi-light--home]`

3. [VSCode Icons (vscode-icons)](https://icon-sets.iconify.design/vscode-icons/)
    - Специальные иконки для типов файлов
    - Пример: `icon-[vscode-icons--file-type-tailwind]`

## 🛠 Как использовать

Просто вставляйте тег с нужным классом:

```tsx
// Стандартные иконки
<button>
  <span className="icon-[mdi-light--home] text-2xl"></span>
  Домой
</button>

// Иконки типов файлов
<div className="flex items-center">
  <span className="icon-[vscode-icons--file-type-reactjs] mr-2"></span>
  React-компонент
</div>
```

## 🔍 Почему иконка может не отображаться?

1. **Неправильное имя** - проверьте точное название на сайте Iconify
2. **Коллекция не установлена** - для vscode-icons нужно:
   ```bash
   npm install @iconify-json/vscode-icons
   ```
3. **Ошибка в классе** - сравните с рабочими примерами

## ➕ Добавление новых коллекций

1. Найдите нужную коллекцию на Iconify
2. Установите пакет:
   ```bash
   npm install @iconify-json/название-коллекции
   ```
3. Добавьте в `tailwind.config.ts`:
   ```ts
   plugins: [
     addIconSelectors(["mdi", "mdi-light", "vscode-icons", "новая-коллекция"]),
   ]
   ```

## 💡 Полезные советы

- Для цветных иконок добавьте `?bg=цвет`:
  ```tsx
  <span className="icon-[vscode-icons--file-type-tailwind?bg=#38bdf8]"></span>
  ```
- Размер регулируется через Tailwind: `text-xl`, `text-2xl` и т.д.
- Если иконка не найдена - проверьте консоль браузера на ошибки 404

> ⚠️ Все иконки автоматически оптимизируются и подгружаются только при использовании!
