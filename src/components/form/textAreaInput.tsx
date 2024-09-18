import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type FormInputProbs = {
  name: string;
  value?: string | number;
  placeholder?: string;
  label?: string;
  onChange?: (e: any) => void;
};

const TextAreaInput = (probs: FormInputProbs) => {
  const { name, value, placeholder, label, onChange } = probs;

  return (
    <div className="m-2">
      <Label htmlFor={name} className="capitalize">
        {name || label}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        rows={4}
        required
        placeholder={placeholder}
        onChange={(e: any) => {
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
};

export default TextAreaInput;
