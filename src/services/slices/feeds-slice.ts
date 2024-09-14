import { getFeedsApi } from '../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '../../utils/types';


export const getFeedsThunk = createAsyncThunk(
  'getFeedsThunk',
  async () => {
    try {
      return await getFeedsApi();
    } catch (err) {
      console.log('Ошибка загрузки данных ленты заказов с сервера');
      return await Promise.reject(`Ошибка: ${err}`);
    }
  }
)

export interface feedsState {
  ordersData: TOrdersData;
  isLoading: boolean
}

const initialState: feedsState = {
  ordersData: {orders: [], total: 0, totalToday: 0},
  isLoading: true
}

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedsThunk.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });
    builder.addCase(getFeedsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ordersData = action.payload;
    });
  }
});
