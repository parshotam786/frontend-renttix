import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import headerTitleSlice from "./headerTitleSlice";

import { combineReducers } from "redux";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};

const combineReducer = combineReducers({
  authReducer: authSlice,
  headerTitle: headerTitleSlice,
});

const persistedReducer = persistReducer(persistConfig, combineReducer);
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
