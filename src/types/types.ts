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
  kind: Exclude<FieldType, "derived">; 
  label: string;
  defaultValue?: any;
  validations?: ValidationRules;
  options?: string[];
  required?: boolean;
}

export interface DerivedField {
  id: string;
  kind: "derived"; 
  label: string;
  required?: boolean;
  derived?: DerivedConfig;
  builtIn?: string;  
  parentIds?: string[];
  formula?: string;
}

export type FieldSchema = BaseField | DerivedField;

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldSchema[];
}
