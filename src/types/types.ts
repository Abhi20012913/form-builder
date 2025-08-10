export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "derived";
export function makeId(length: number = 8): string {
  return Math.random().toString(36).substr(2, length);
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean;
}

export interface DerivedConfig {
  parents: string[]; 
  formula: string;   
}

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: any;
  validations?: ValidationRules;
  options?: string[]; 
}

export interface DerivedField extends BaseField {
  type: "derived";
  derived: DerivedConfig;
}

export type FieldSchema = BaseField | DerivedField;

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldSchema[];
}
