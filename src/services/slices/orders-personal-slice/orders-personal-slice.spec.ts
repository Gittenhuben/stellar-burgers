import { afterEach, describe, expect, test } from '@jest/globals';
import { TOrder } from '@utils-types';
import { ordersPersonalSlice, getOrdersPersonalThunk } from './orders-personal-slice';
import * as api from '../../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';


describe('Проверка слайса истории заказов', () => {

  const initialState = ordersPersonalSlice.getInitialState();

  const initialStateTrue = {
    ...initialState,
    isLoading: true
  }

  const initialStateFalse = {
    ...initialState,
    isLoading: false
  }

  const ordersPersonal1: TOrder[] = [
    {
      createdAt: "2024-09-13T01:03:24.426Z",
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
      name: "Краторный бургер",
      number: 52858,
      status: "done",
      updatedAt: "2024-09-13T01:03:24.994Z",
      _id: "66e38f5c119d45001b5068cc"
    },
    {
      createdAt: "2024-09-13T01:06:10.849Z",
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
      name: "Флюоресцентный бургер",
      number: 52859,
      status: "done",
      updatedAt: "2024-09-13T01:06:11.369Z",
      _id: "66e39002119d45001b5068ce"
    }
  ]

  const ordersPersonalResponse1 = {
    ...ordersPersonal1,
    success: true
  }

  describe('Проверка экшенов', () => {

    test('Тест getOrdersPersonalThunk, action: pending', () => {
      
      const fakeStore = configureStore({
        reducer: ordersPersonalSlice.reducer,
        preloadedState: initialStateFalse
      });

      const action = getOrdersPersonalThunk.pending('fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
    });

    test('Тест getOrdersPersonalThunk, action: fulfilled', () => {
      
      const fakeStore = configureStore({
        reducer: ordersPersonalSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getOrdersPersonalThunk.fulfilled(ordersPersonalResponse1, 'fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(ordersPersonalResponse1);
    });

    test('Тест getOrdersPersonalThunk, action: rejected', () => {
      
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: ordersPersonalSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getOrdersPersonalThunk.rejected(new Error('fakeError'), 'fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('fakeError');
    });

  });


  describe('Проверка санка getOrdersPersonalThunk', () => {  

    afterEach(() => {
      (api.getOrdersApi as jest.Mock).mockRestore();
    })

    test('Тест санка getOrdersPersonalThunk: pending', async () => {
      
      (api.getOrdersApi as jest.Mock) = jest.fn(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(ordersPersonalResponse1), 1000);
        });
      });

      const fakeStore = configureStore({
        reducer: ordersPersonalSlice.reducer,
        preloadedState: initialStateFalse
      });

      fakeStore.dispatch(getOrdersPersonalThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
      
    });

    test('Тест санка getOrdersPersonalThunk: fulfilled', async () => {
      
      (api.getOrdersApi as jest.Mock) = jest.fn(() => Promise.resolve(ordersPersonalResponse1));

      const fakeStore = configureStore({
        reducer: ordersPersonalSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getOrdersPersonalThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(ordersPersonalResponse1);

    });

    test('Тест санка getOrdersPersonalThunk: rejected', async () => {
      
      (api.getOrdersApi as jest.Mock) = jest.fn(() => Promise.reject('fakeError'));

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: ordersPersonalSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getOrdersPersonalThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

    });

  });

});
