import { getOrderByNumberApi } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';


export const getOrdersSingleThunk = createAsyncThunk(
  'getOrdersSingleThunk',
  async (orderNumber: number) => {
    try {
      return await getOrderByNumberApi(orderNumber);
    } catch (err) {
      console.log('Ошибка загрузки данных о заказе с сервера');
      return await Promise.reject(`Ошибка: ${err}`);
    }
  }
)

export interface ordersSingleState {
  orders: TOrder[];
  isLoading: boolean
}

const initialState: ordersSingleState = {
  orders: [],
  isLoading: true
}

export const ordersSingleSlice = createSlice({
  name: 'ordersSingle',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getOrdersSingleThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrdersSingleThunk.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });
    builder.addCase(getOrdersSingleThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = state.orders.filter(elem => elem.number != action.payload.orders[0].number);
      state.orders.push(action.payload.orders[0]);
    });
  }
});
