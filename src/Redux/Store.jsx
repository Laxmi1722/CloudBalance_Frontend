
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './AuthSlice';
import onboardingReducer from './OnboardingSlice'; 
import tokenExpirationMiddleware from '../Middleware/Middleware';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer, 
  onboarding: onboardingReducer, 
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tokenExpirationMiddleware),
  
});

export const persistor = persistStore(store);