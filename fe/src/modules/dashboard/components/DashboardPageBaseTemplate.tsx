import React from 'react';

interface DashboardPageBaseTemplateProps {
  title: string;
  children: React.ReactNode;
}

export const DashboardPageBaseTemplate: React.FC<DashboardPageBaseTemplateProps> = ({ title, children }) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="w-full">
        {/* TODO: Нужно сделать высоту этого блока такой чтобы не появлялся глобальный скролл */}
        {children}
      </div>
    </div>
  );
};
