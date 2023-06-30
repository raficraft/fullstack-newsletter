export type FormValidity =
  | 'required'
  | 'type'
  | 'pattern'
  | 'maxLength'
  | 'minLength'
  | 'min'
  | 'max'
  | 'step'
  | 'custom';

export type FormElementType =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type FieldErrorMessages = {
  [key: string]: {
    message: string;
    customValidation?: (value: string) => boolean;
    callback?: () => void;
  };
};

export type FieldsOptions = Partial<Record<string, FieldErrorMessages>>;

export type FormErrors = Partial<Record<string, string>>;

export type UseFormOptions = {
  local?: string;
  fields: FieldsOptions;
};

export type FormValues = Record<string, string | Blob>;

export type UseFormReturn = {
  validateForm: (event: React.FormEvent<HTMLFormElement>) => boolean;
  getFormData: (
    event: React.FormEvent<HTMLFormElement>
  ) => Record<string, string>;
  validateField: <T extends FormElementType>(
    event: React.FormEvent<T>,
    showError?: boolean
  ) => boolean;
  errors: Record<string, string | undefined>;
  reset: () => void;
};
