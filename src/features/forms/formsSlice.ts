import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type FormSchema } from "../../types/types";
import { loadForms, saveForms } from "../../utils/localStorage";

interface FormsState {
  forms: FormSchema[];
}

const initialState: FormsState = {
  forms: loadForms(),
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    saveForm: (state, action: PayloadAction<FormSchema>) => {
      state.forms.unshift(action.payload);
      saveForms(state.forms);
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter((f) => f.id !== action.payload);
      saveForms(state.forms);
    },
    loadFromStorage: (state) => {
      state.forms = loadForms();
    },
  },
});

export const { saveForm, deleteForm, loadFromStorage } = formsSlice.actions;
export default formsSlice.reducer;
