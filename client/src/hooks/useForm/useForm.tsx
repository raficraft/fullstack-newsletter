import { useState } from 'react';
import {
  FieldErrorMessages,
  FormElementType,
  FormErrors,
  FormValidity,
  UseFormOptions,
  UseFormReturn,
} from './types';

const useForm = ({ fields = {} }: UseFormOptions): UseFormReturn => {
  const [errors, setErrors] = useState<FormErrors>({});

  // Récupère tous les éléments du formulaire
  const getFormElements = (
    event: React.FormEvent<HTMLFormElement>
  ): FormElementType[] => {
    const form = event.currentTarget;
    return Array.from(form.elements) as FormElementType[];
  };

  // Construit un objet avec les valeurs de chaque champ du formulaire
  const getFormData = (event: React.FormEvent<HTMLFormElement>) => {
    const elements = getFormElements(event);
    return elements.reduce((formData, element) => {
      formData[element.name] = element.value;
      return formData;
    }, {} as Record<string, string>);
  };

  // Map les noms des propriétés HTML ValidityState avec des noms personnalisés
  const getValidityLabel = (key: string) => {
    const validityLabels: Record<string, string> = {
      required: 'valueMissing',
      pattern: 'patternMismatch',
      maxLength: 'tooLong',
      minLength: 'tooShort',
      min: 'rangeUnderflow',
      max: 'rangeOverflow',
      step: 'stepMismatch',
      typeMismatch: 'typeMismatch',
    };
    return validityLabels[key] || key;
  };

  // Valide tous les champs du formulaire
  const validateForm = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    const elements = getFormElements(event);
    const formErrors: FormErrors = {};

    elements.forEach((element) => {
      if (element.tagName === 'BUTTON' || element.disabled) return;
      const name = element.name;
      if (!element.checkValidity()) {
        const errorMessage = getErrorMessage(fields[name], element);
        formErrors[name] = errorMessage || element.validationMessage;
      }
    });

    if (Object.entries(formErrors).length > 0) {
      setErrors(formErrors);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  // Valide un champ de formulaire spécifique
  const validateField = <T extends FormElementType>(
    event: React.FormEvent<T>
  ): boolean => {
    const element = event.target as T;
    const name = element.name!;
    const isValid = element.checkValidity();
    const errorMessage = getErrorMessage(fields[name], element);

    if (!name) {
      throw new Error("Le champ n'a pas de nom.");
    }

    if (isValid) {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage || element.validationMessage,
      }));
    }

    return isValid;
  };

  // Récupère un message d'erreur personnalisé pour un champ donné
  const getErrorMessage = <T extends FormElementType>(
    field: FieldErrorMessages = {},
    element: T
  ): string | undefined => {
    const validityKeys = Object.keys(field) as FormValidity[];

    if (field.custom && field.custom.customValidation) {
      const { message, customValidation } = field.custom;
      if (!customValidation(element.value)) {
        return message;
      }
    }

    for (const key of validityKeys) {
      const validityLabel = getValidityLabel(key);
      if (element.validity[validityLabel as keyof ValidityState]) {
        const errorMessage = field[key]?.message;
        const callback = field[key]?.callback;
        if (callback) callback();
        return errorMessage;
      }
    }

    return element.validationMessage;
  };

  // Réinitialise les erreurs du formulaire
  const reset = () => {
    setErrors({});
  };

  // Retourne une API pour utiliser le hook
  return {
    validateForm,
    validateField,
    getFormData,
    reset,
    errors,
  };
};

export default useForm;
