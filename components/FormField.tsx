import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem style={{ marginBottom: '1rem' }}>
          <FormLabel style={{
            display: 'block',
            fontWeight: 600,
            color: 'var(--gray-700)',
            marginBottom: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem',
                transition: 'all var(--transition-fast)',
                background: 'white',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--gray-200)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </FormControl>
          <FormMessage style={{
            color: 'var(--error-500)',
            fontSize: '0.75rem',
            marginTop: '0.25rem'
          }} />
        </FormItem>
      )}
    />
  );
};

export default FormField;
