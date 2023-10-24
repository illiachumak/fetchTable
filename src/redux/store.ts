import { configureStore} from '@reduxjs/toolkit';
import login from './slices/loginSlice';
import tableSlice from './slices/tableSlice';

const store = configureStore({
  reducer: {
    login,
    table: tableSlice,
  }
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
