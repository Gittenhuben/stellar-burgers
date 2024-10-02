import { afterEach, describe, expect, test } from '@jest/globals';
import { TOrder } from '@utils-types';
import { ordersSingleSlice, getOrdersSingleThunk } from './orders-single-slice';
import * as api from '../../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';


describe('Проверка слайса информации о заказе', () => {

  const order1: TOrder = {
      createdAt: "2024-09-30T05:39:52.856Z",
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093d'
      ],
      name: "Space флюоресцентный люминесцентный бургер",
      number: 54640,
      status: "done",
      updatedAt: "2024-09-30T05:39:53.583Z",
      _id: "66fa39a8119d45001b50a6c7"
  }

  const order2: TOrder = {
    createdAt: "2024-09-30T05:37:03.142Z",
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
    name: "Флюоресцентный бургер",
    number: 54638,
    status: "done",
    updatedAt: "2024-09-30T05:37:03.925Z",
    _id: "66fa38ff119d45001b50a6c5"
  }
  
  const ordersSingleResponse1 = {
    orders: [order1],
    success: true
  }

  const initialState = ordersSingleSlice.getInitialState();

  const initialStateTrue = {
    ...initialState,
    orders: [order2],
    isLoading: true
  }

  const initialStateFalse = {
    ...initialState,
    orders: [order2],
    isLoading: false
  }

  describe('Проверка экшенов', () => {

    test('Тест getOrdersSingleThunk, action: pending', () => {
      
      const fakeStore = configureStore({
        reducer: ordersSingleSlice.reducer,
        preloadedState: initialStateFalse
      });

      const action = getOrdersSingleThunk.pending('fakeRequestId', order1.number);
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
    });

    test('Тест getOrdersSingleThunk, action: fulfilled', () => {
      
      const fakeStore = configureStore({
        reducer: ordersSingleSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getOrdersSingleThunk.fulfilled(ordersSingleResponse1, 'fakeRequestId', order1.number);
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([order2, order1]);
    });

    test('Тест getOrdersSingleThunk, action: rejected', () => {
      
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: ordersSingleSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getOrdersSingleThunk.rejected(new Error('fakeError'), 'fakeRequestId', order1.number);
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('fakeError');
    });

  });


  describe('Проверка санка getOrdersSingleThunk', () => {  

    afterEach(() => {
      (api.getOrderByNumberApi as jest.Mock).mockRestore();
    })

    test('Тест санка getOrdersSingleThunk: pending', async () => {
      
      (api.getOrderByNumberApi as jest.Mock) = jest.fn((number: number) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(ordersSingleResponse1), 1000);
        });
      });

      const fakeStore = configureStore({
        reducer: ordersSingleSlice.reducer,
        preloadedState: initialStateFalse
      });

      fakeStore.dispatch(getOrdersSingleThunk(order1.number));

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
      
    });

    test('Тест санка getOrdersSingleThunk: fulfilled', async () => {
      
      (api.getOrderByNumberApi as jest.Mock) = jest.fn((number: number) => Promise.resolve(ordersSingleResponse1));

      const fakeStore = configureStore({
        reducer: ordersSingleSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getOrdersSingleThunk(order1.number));

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([order2, order1]);

    });

    test('Тест санка getOrdersSingleThunk: rejected', async () => {
      
      (api.getOrderByNumberApi as jest.Mock) = jest.fn((number: number) => Promise.reject('fakeError'));

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: ordersSingleSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getOrdersSingleThunk(order1.number));

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

    });

  });

});
