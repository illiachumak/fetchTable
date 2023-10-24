import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

async function loginUser(username: string, password: string): Promise<{ message: string, name: string }> {
    const endpoint = 'https://technical-task-api.icapgroupgmbh.com/api/login/';

    try {
        const response = await axios.post(endpoint, {
            username: username,
            password: password
        });

        return {
            message: response.data.message,
            name: username
        };

    } catch (error) {
        throw error;
    }
}

  
  export const login = createAsyncThunk(
    'login/userLogin',
    async ({ username, password }: { username: string; password: string }) => {
      return await loginUser(username, password);
    }
  );
  
  export type LoginState = {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    username: string | null;
  };
  
  const initialState: LoginState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    username: null,
  };
  
  const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
      logOut: () => {
        localStorage.removeItem('user')
        window.location.reload()
      },
    },
    extraReducers: (builder) => {
      builder.addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.name;
        localStorage.setItem('user', `${action.payload.name}`)
      });
      builder.addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = 'Username or password is incorrect!';
      });
    },
  });

  export const { logOut } = loginSlice.actions;
  
  export default loginSlice.reducer;
  