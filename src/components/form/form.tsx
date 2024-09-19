// components/Form.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";

type FormFieldProps = {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

type FormProps = {
  onSubmit: (data: Record<string, any>) => void;
  btnName?: string;
  btnClass?: string;
  children: React.ReactElement<FormFieldProps>;
  btnAlign?: string;
  className?: string;
};

const Form: React.FC<FormProps> = ({
  onSubmit,
  btnName,
  btnClass,
  children,
  btnAlign,
  className,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const allData = { ...formData };
      await onSubmit(allData);
      setFormData({});
      React.Children.map(children, (child) => {
        console.log(child);
      });
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onChange: handleChange,
            value: formData[child.props.name] || "",
          });
        }
        return child;
      })}
      <div className={`flex justify-${btnAlign} items-center p-1`}>
        <Button type="submit" className={btnClass}>
          {btnName ? btnName : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default Form;

// Example Form
{
  /* <Form
  onSubmit={handleSubmit}
  btnName="Form"
  btnAlign="end"
  className="bg-black/30 p-3 rounded"
>
  <div>
    <FormInput
      name="phone"
      type="text"
      minLength={10}
      required
    />
    <FormInput name="name" type="text" />
    <FormInput name="email" type="email" />
    <FormInput name="password" type="password" />
  </div>
</Form>; */
}
