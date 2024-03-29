import {configureStore} from '@reduxjs/toolkit';

import {combineReducers} from 'redux';
import locationReducer from './locations'
import employeeReducer from './employees';

import storageSession from 'redux-persist/lib/storage/session'

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

// const persistConfig = {
//     key: 'counter',
//     storage: storageSession
// };

const reducers = combineReducers({
    rlocations: locationReducer,
    remployees: employeeReducer
})

// const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: reducers
})