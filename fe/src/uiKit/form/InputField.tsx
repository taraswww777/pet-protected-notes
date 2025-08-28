import React from 'react';
import { Input, InputProps, InputVariant } from './Input';
import { Label } from './Label.tsx';
import { isString } from 'lodash';


type InputFieldProps = InputProps & {
  name: string,
  label?: string,
}


export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  className = '',
  error,
  variant,
  placeholder,
  ...props
}) => {
  const calcPlaceholder = placeholder || (label && `Введите ${label.toLowerCase()}`) || '';

  return (
    <div className={`flex flex-wrap w-auto gap-y-1 ${className}`}>
      {label && <Label htmlFor={name}>{label}</Label>}

      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        variant={error ? InputVariant.DANGER : variant}
        placeholder={calcPlaceholder}
        {...props}
      />
      {error && isString(error) ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <p className="text-sm text-red-600">{error?.toString()}</p>
      )}
    </div>
  );
};

