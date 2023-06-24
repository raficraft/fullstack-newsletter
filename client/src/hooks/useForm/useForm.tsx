import { useState } from "react";
import {
  FieldErrorMessages,
  FormElementType,
  FormErrors,
  FormValidity,
  UseFormOptions,
  UseFormReturn,
} from "./types";

const useForm = ({ fields = {} }: UseFormOptions): UseFormReturn => {
  const [errors, setErrors] = useState<FormErrors>({});

  const getFormElements = (
    event: React.FormEvent<HTMLFormElement>
  ): FormElementType[] => {
    const form = event.currentTarget;
    return Array.from(form.elements) as FormElementType[];
  };

  const getFormData = (event: React.FormEvent<HTMLFormElement>) => {
    const elements = getFormElements(event);
    const formData: any = [];
    elements.forEach((element) => {
      const name = element.name;
      formData[name] = element.value;
    });
    return formData;
  };

  const validateForm = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    const elements = getFormElements(event);
    const formErrors: FormErrors = {};

    // Ajout d'un tableau pour stocker les noms des champs valides
    const validFields: string[] = [];

    for (const element of elements) {
      if (element.tagName === "BUTTON" || element.disabled) continue;
      if (!element.checkValidity()) {
        const name = element.name;
        const errorMessage = getErrorMessage(fields[name], element);
        formErrors[name] = errorMessage || element.validationMessage!;
      } else {
        // Si le champ est valide, on l'ajoute au tableau des champs valides
        validFields.push(element.name);
      }
    }

    // On parcourt le tableau des champs valides et on supprime les erreurs de ces champs s'ils existent
    for (const name of validFields) {
      if (formErrors[name]) {
        delete formErrors[name];
      }
    }

    if (Object.entries(formErrors).length > 0) {
      setErrors(formErrors);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const validateField = <T extends FormElementType>(
    event: React.FormEvent<T>
  ): boolean => {
    const element = event.target as T;
    const name = element.name!;
    const isValid = element.checkValidity();

    if (!name) {
      throw new Error("Le champ n'a pas de nom.");
    }

    const previousError = errors[name];

    if (isValid && previousError) {
      // Retirer l'erreur précédente
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    } else if (
      !isValid &&
      previousError !== getErrorMessage(fields[name], element)
    ) {
      // Vérifier si l'erreur existe déjà
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: getErrorMessage(fields[name], element),
      }));
    } else if (!isValid && !previousError) {
      // Ajouter une nouvelle erreur
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: getErrorMessage(fields[name], element),
      }));
    }

    return isValid;
  };

  const getErrorMessage = <T extends FormElementType>(
    field: FieldErrorMessages = {},
    element: T
  ): string | undefined => {
    const validityKeys = Object.keys(field) as FormValidity[];

    if (Object.keys(field).length === 0) {
      return element.validationMessage;
    }

    // Traiter d'abord les validations personnalisées
    if (field.custom && field.custom.customValidation) {
      const { message, customValidation } = field.custom;

      if (!customValidation(element.value)) {
        return message;
      }
    }

    for (const key of validityKeys) {
      let validityLabel;

      switch (key) {
        case "required":
          validityLabel = "valueMissing";
          break;
        case "pattern":
          validityLabel = "patternMismatch";
          break;
        case "maxLength":
          validityLabel = "tooLong";
          break;
        case "minLength":
          validityLabel = "tooShort";
          break;
        case "min":
          validityLabel = "rangeUnderflow";
          break;
        case "max":
          validityLabel = "rangeOverflow";
          break;
        case "step":
          validityLabel = "stepMismatch";
          break;
        default:
          validityLabel = key;
      }

      if (
        element.validity &&
        element.validity[validityLabel as keyof ValidityState]
      ) {
        const errorMessage = field[key]?.message || element.validationMessage;
        const callback = field[key]?.callback;
        if (callback) callback();
        return errorMessage;
      }
    }

    return undefined;
  };

  const reset = () => {
    setErrors({});
  };

  return {
    validateForm,
    validateField,
    getFormData,
    reset,
    errors,
  };
};

export default useForm;
