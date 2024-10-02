import { afterEach, describe, expect, test } from '@jest/globals';
import { TOrdersData } from '@utils-types';
import { feedsSlice, getFeedsThunk } from './feeds-slice';
import * as api from '../../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';


describe('Проверка слайса ленты заказов', () => {

  const initialState = feedsSlice.getInitialState();

  const initialStateTrue = {
    ...initialState,
    isLoading: true
  }

  const initialStateFalse = {
    ...initialState,
    isLoading: false
  }

  const feed1: TOrdersData = {
    orders: [
      {
        createdAt: "2024-10-01T18:38:17.349Z",
        ingredients: [
          "643d69a5c3f7b9001cfa093d",
          "643d69a5c3f7b9001cfa0941",
          "643d69a5c3f7b9001cfa093d"
        ],
        name: "Флюоресцентный био-марсианский бургер",
        number: 54790,
        status: "done",
        updatedAt: "2024-10-01T18:38:18.133Z",
        _id: "66fc419907cc0b001c1d5360"
      },
      {
        createdAt: "2024-10-01T18:36:29.432Z",
        ingredients: [
          "643d69a5c3f7b9001cfa093c",
          "643d69a5c3f7b9001cfa0947",
          "643d69a5c3f7b9001cfa093e",
          "643d69a5c3f7b9001cfa093c"
        ],
        name: "Краторный фалленианский люминесцентный бургер",
        number: 54789,
        status: "done",
        updatedAt: "2024-10-01T18:36:35.206Z",
        _id: "66fc412d07cc0b001c1d535e"
      }
    ],
    total: 54416,
    totalToday: 76
  }

  const feedResponse1 = {
    ...feed1,
    success: true
  }

  describe('Проверка экшенов', () => {

    test('Тест getFeedsThunk, action: pending', () => {
      
      const fakeStore = configureStore({
        reducer: feedsSlice.reducer,
        preloadedState: initialStateFalse
      });

      const action = getFeedsThunk.pending('fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
    });

    test('Тест getFeedsThunk, action: fulfilled', () => {
      
      const fakeStore = configureStore({
        reducer: feedsSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getFeedsThunk.fulfilled(feedResponse1, 'fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.ordersData).toEqual(feedResponse1);
    });

    test('Тест getFeedsThunk, action: rejected', () => {
      
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: feedsSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getFeedsThunk.rejected(new Error('fakeError'), 'fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('fakeError');
    });

  });


  describe('Проверка санка getFeedsThunk', () => {  

    afterEach(() => {
      (api.getFeedsApi as jest.Mock).mockRestore();
    })

    test('Тест санка getFeedsThunk: pending', async () => {
      
      (api.getFeedsApi as jest.Mock) = jest.fn(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(feedResponse1), 1000);
        });
      });

      const fakeStore = configureStore({
        reducer: feedsSlice.reducer,
        preloadedState: initialStateFalse
      });

      fakeStore.dispatch(getFeedsThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
      
    });

    test('Тест санка getFeedsThunk: fulfilled', async () => {
      
      (api.getFeedsApi as jest.Mock) = jest.fn(() => Promise.resolve(feedResponse1));

      const fakeStore = configureStore({
        reducer: feedsSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getFeedsThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.ordersData).toEqual(feedResponse1);

    });

    test('Тест санка getFeedsThunk: rejected', async () => {
      
      (api.getFeedsApi as jest.Mock) = jest.fn(() => Promise.reject('fakeError'));

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: feedsSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getFeedsThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

    });

  });

});
