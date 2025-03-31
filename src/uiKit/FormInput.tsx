import { Label } from './Label';
import { Input } from './Input';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({ label, type, name, id, placeholder, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}; 