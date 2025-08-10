import { type FieldSchema } from "../types/types";

export function validateFieldValue(field: FieldSchema, value: any): string[] {
  const errors: string[] = [];
  if ((field as any).required) {
    if (
      value === "" ||
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      errors.push("This field is required");
      return errors; 
    }
  }

  const v = (field as any).validations;

  if (v?.minLength != null && String(value).length < v.minLength) {
    errors.push(`Minimum length is ${v.minLength}`);
  }
  if (v?.maxLength != null && String(value).length > v.maxLength) {
    errors.push(`Maximum length is ${v.maxLength}`);
  }
  if (v?.email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(value))) errors.push("Invalid email address");
  }
  if (v?.passwordRule) {
    const pr = v.passwordRule;
    if (String(value).length < pr.minLength) errors.push(`Password min ${pr.minLength}`);
    if (pr.mustContainNumber && !/\d/.test(String(value)))
      errors.push("Password must contain a number");
  }

  return errors;
}
