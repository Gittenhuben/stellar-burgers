import { getUserApi, updateUserApi, TRegisterData } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const getUserThunk = createAsyncThunk(
  'getUserThunk',
  async () => {
    try {
      return await getUserApi();
    } catch (err) {
      console.log('Ошибка загрузки данных пользователя с сервера');
      return await Promise.reject(`Ошибка: ${err}`);
    }
  }
)

export const setUserThunk = createAsyncThunk(
  'setUserThunk',
  async (userData: Partial<TRegisterData>) => {
    try {
      return await updateUserApi(userData);
    } catch (err) {
      console.log('Ошибка выгрузки данных пользователя на сервер');
      return await Promise.reject(`Ошибка: ${(err as Error).message}`);
    }
  }
)

export interface userState {
  userName: string;
  email: string;
  isLoadingGetUser: boolean;
  isLoadingSetUser: boolean;
  errorTextSetUser: string;
}

const initialState: userState = {
  userName: '',
  email: '',
  isLoadingGetUser: true,
  isLoadingSetUser: true,
  errorTextSetUser: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLocalUser: (state, action) => {
      state.userName = action.payload.userName;
      state.email = action.payload.email;
    },
    reset: (state) => {
      state.userName = '';
      state.email = '';
      state.isLoadingGetUser = false;
    }
  },
  
  extraReducers: (builder) => {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoadingGetUser = true;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      console.log(action.error.message);
      state.userName = '';
      state.email = '';
      state.isLoadingGetUser = false;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.userName = action.payload.user.name;
      state.email = action.payload.user.email;
      state.isLoadingGetUser = false;
    });

    builder.addCase(setUserThunk.pending, (state) => {
      state.isLoadingSetUser = true;
      state.errorTextSetUser = '';
    });
    builder.addCase(setUserThunk.rejected, (state, action) => {
      state.isLoadingSetUser = false;
      if (action.error.message && action.error.message != 'Ошибка: undefined') {
        state.errorTextSetUser = action.error.message;
        console.log(action.error.message);
      } else {
        state.errorTextSetUser = 'Ошибка изменения данных пользователя';
        console.log('Ошибка изменения данных пользователя');
      }
    });
    builder.addCase(setUserThunk.fulfilled, (state, action) => {
      state.userName = action.payload.user.name;
      state.email = action.payload.user.email;
      state.isLoadingSetUser = false;
    });
  }
});
