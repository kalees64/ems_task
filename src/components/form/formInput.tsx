import { Label } from "../ui/label";
import { Input } from "../ui/input";

type FormInputProbs = {
  name: string;
  type: string;
  value?: string | number;
  placeholder?: string;
  label?: string;
  onChange?: (e: any | null) => void;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
};

const FormInput = (probs: FormInputProbs) => {
  const {
    name,
    type,
    value,
    placeholder,
    label,
    onChange,
    min,
    max,
    minLength,
    maxLength,
    required,
  } = probs;

  return (
    <div className="m-2">
      <Label htmlFor={name} className="capitalize">
        {name || label}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        required={required || true}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default FormInput;
