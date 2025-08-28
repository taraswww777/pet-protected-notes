import { FC, ReactNode } from 'react';

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

export const Label: FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block w-full text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};
