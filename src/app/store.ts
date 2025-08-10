import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "../features/builder/builderSlice";
import formsReducer from "../features/forms/formsSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
