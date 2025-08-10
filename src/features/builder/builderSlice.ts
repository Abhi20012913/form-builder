import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type BaseField, type DerivedField, type FieldSchema } from "../../types/types";

function makeId(): string {
  return Math.random().toString(36).substr(2, 9);
}

interface BuilderState {
  name: string;
  fields: FieldSchema[];
}

const initialState: BuilderState = {
  name: "Untitled Form",
  fields: [],
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    resetBuilder: (state) => {
      state.name = "Untitled Form";
      state.fields = [];
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setFields: (state, action: PayloadAction<FieldSchema[]>) => {
      state.fields = action.payload;
    },
    addField: (state, action: PayloadAction<{ kind: FieldSchema["kind"] }>) => {
      const kind = action.payload.kind;
      const id = makeId();

      if (kind === "derived") {
        const df: DerivedField = {
          id,
          kind: "derived",
          label: "Derived Field",
          required: false,
          parentIds: [],
          formula: "",
          builtIn: undefined,
        };
        state.fields.push(df);
      } else {
        const bf: BaseField = {
          id,
          kind: kind,
          label: `${kind} field`,
          required: false,
          defaultValue: kind === "checkbox" ? [] : "",
          validations: {},
          options: kind === "select" || kind === "radio" ? ["Option 1", "Option 2"] : undefined,
        };
        state.fields.push(bf);
      }
    },
    updateField: (state, action: PayloadAction<FieldSchema>) => {
      const idx = state.fields.findIndex((f) => f.id === action.payload.id);
      if (idx >= 0) {
        state.fields[idx] = action.payload;
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
    },
    moveField: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (from < 0 || to < 0 || from >= state.fields.length || to >= state.fields.length) return;
      const copy = [...state.fields];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      state.fields = copy;
    },
  },
});

export const {
  resetBuilder,
  setFormName,
  setFields,
  addField,
  updateField,
  removeField,
  moveField,
} = builderSlice.actions;

export default builderSlice.reducer;
