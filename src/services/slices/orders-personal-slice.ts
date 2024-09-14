import { getOrdersApi } from '../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';


export const getOrdersPersonalThunk = createAsyncThunk(
  'getOrdersPersonalThunk',
  async () => {
    try {
      return await getOrdersApi();
    } catch (err) {
      console.log('Ошибка загрузки данных о личных заказах с сервера');
      return await Promise.reject(`Ошибка: ${err}`);
    }
  }
)

export interface ordersPersonalState {
  orders: TOrder[];
  isLoading: boolean
}

const initialState: ordersPersonalState = {
  orders: [],
  isLoading: true
}

export const ordersPersonalSlice = createSlice({
  name: 'ordersPersonal',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getOrdersPersonalThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrdersPersonalThunk.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });
    builder.addCase(getOrdersPersonalThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
  }
});
