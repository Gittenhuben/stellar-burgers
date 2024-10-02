import { afterEach, describe, expect, test } from '@jest/globals';
import { TIngredient } from '@utils-types';
import { ingredientsSlice, getIngredientsThunk } from './ingredients-slice';
import * as api from '../../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';


describe('Проверка слайса ингредиентов', () => {

  const initialState = ingredientsSlice.getInitialState();

  const initialStateTrue = {
    ...initialState,
    isLoading: true
  }

  const initialStateFalse = {
    ...initialState,
    isLoading: false
  }

  const ingredient1: TIngredient = {
    calories: 4242,
    carbohydrates: 242,
    fat: 142,
    image: "https://code.s3.yandex.net/react/code/meat-01.png",
    image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
    image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
    name: "Биокотлета из марсианской Магнолии",
    price: 424,
    proteins: 420,
    type: "main",
    _id: "643d69a5c3f7b9001cfa0941"
  }  

  const ingredient2: TIngredient = {
    calories: 643,
    carbohydrates: 85,
    fat: 26,
    image: "https://code.s3.yandex.net/react/code/meat-03.png",
    image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
    image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
    name: "Филе Люминесцентного тетраодонтимформа",
    price: 988,
    proteins: 44,
    type: "main",
    _id: "643d69a5c3f7b9001cfa093e"
  }  

  describe('Проверка экшенов', () => {

    test('Тест getIngredientsThunk, action: pending', () => {
      
      const fakeStore = configureStore({
        reducer: ingredientsSlice.reducer,
        preloadedState: initialStateFalse
      });

      const action = getIngredientsThunk.pending('fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
    });

    test('Тест getIngredientsThunk, action: fulfilled', () => {
      
      const fakeStore = configureStore({
        reducer: ingredientsSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getIngredientsThunk.fulfilled([ingredient1, ingredient2], 'fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual([ingredient1, ingredient2]);
    });

    test('Тест getIngredientsThunk, action: rejected', () => {
      
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: ingredientsSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = getIngredientsThunk.rejected(new Error('fakeError'), 'fakeRequestId');
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('fakeError');
    });

  });


  describe('Проверка санка getIngredientsThunk', () => {  

    afterEach(() => {
      (api.getIngredientsApi as jest.Mock).mockRestore();
    })

    test('Тест санка getIngredientsThunk: pending', async () => {
      
      (api.getIngredientsApi as jest.Mock) = jest.fn(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(
            [ingredient1, ingredient2]
          ), 1000);
        });
      }); 

      const fakeStore = configureStore({
        reducer: ingredientsSlice.reducer,
        preloadedState: initialStateFalse
      });

      fakeStore.dispatch(getIngredientsThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(true);
      
    });

    test('Тест санка getIngredientsThunk: fulfilled', async () => {
      
      (api.getIngredientsApi as jest.Mock) = jest.fn(() => Promise.resolve(
        [ingredient1, ingredient2]
      ));

      const fakeStore = configureStore({
        reducer: ingredientsSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getIngredientsThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual([ingredient1, ingredient2]);

    });

    test('Тест санка getIngredientsThunk: rejected', async () => {
      
      (api.getIngredientsApi as jest.Mock) = jest.fn(() => Promise.reject('fakeError'));

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: ingredientsSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(getIngredientsThunk());

      const state = fakeStore.getState();
      expect(state.isLoading).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

    });

  });

});
