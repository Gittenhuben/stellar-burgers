import { afterEach, describe, expect, test} from '@jest/globals';
import { TIngredient, TOrder } from '@utils-types';
import { constructorSlice, orderBurgerThunk } from './constructor-slice';
import * as api from '../../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';


describe('Проверка слайса конструктора', () => {

  const initialState = constructorSlice.getInitialState();

  const initialStateTrue = {
    ...initialState,
    orderRequest: true
  }

  const initialStateFalse = {
    ...initialState,
    orderRequest: false
  }

  const ingredient0: TIngredient = {
    calories: 643,
    carbohydrates: 85,
    fat: 26,
    image: "https://code.s3.yandex.net/react/code/bun-01.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-01-large.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
    name: "Флюоресцентная булка R2-D3",
    price: 988,
    proteins: 44,
    type: "bun",
    _id: "643d69a5c3f7b9001cfa093d"
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

  const orderIngredients1: string[] = [
    ingredient0._id,
    ingredient1._id,
    ingredient2._id,
    ingredient0._id,
  ]

  const order1: TOrder = {
    ingredients: orderIngredients1,
    _id: "66fc765007cc0b001c1d53b8",
    status: "done",
    name: "Флюоресцентный люминесцентный био-марсианский бургер",
    createdAt: "2024-10-01T22:23:12.637Z",
    updatedAt: "2024-10-01T22:23:13.526Z",
    number: 54794
  }

  const orderResponse1 = {
    success: true,
    name: order1.name,
    order: order1
  }

  describe('Проверка основных редьюсеров', () => {

    const expectedState1 = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [{...ingredient1, id: "0"}]
      },
      idCounter: 1
    }

    const expectedState2 = {
      ...initialState,
      idCounter: 1
    }

    const expectedState3 = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        bun: ingredient0
      },  
    }

    const expectedState4 = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [{...ingredient1, id: "0"}, {...ingredient2, id: "1"}]
      },
      idCounter: 2
    }

    const expectedState5 = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [{...ingredient2, id: "1"}, {...ingredient1, id: "0"}]
      },
      idCounter: 2
    }

    const expectedState6 = {
      ...initialState,
      idCounter: 2
    }

    test('Тест добавления ингредиента в конструктор', () => {
      const newState = constructorSlice.reducer(initialState, {type: 'constructor/addIngredient', payload: ingredient1});
      expect(newState).toEqual(expectedState1);
    });

    test('Тест удаления ингредиента из конструктора', () => {
      const newState = constructorSlice.reducer(expectedState1, {type: 'constructor/removeIngredient', payload: {...ingredient1, id: "0"}});
      expect(newState).toEqual(expectedState2);
    });

    test('Тест добавления булки в конструктор', () => {
      const newState = constructorSlice.reducer(initialState, {type: 'constructor/addIngredient', payload: ingredient0});
      expect(newState).toEqual(expectedState3);
    });

    test('Тест удаления булки из конструктора', () => {
      const newState = constructorSlice.reducer(expectedState3, {type: 'constructor/removeIngredient', payload: ingredient0});
      expect(newState).toEqual(initialState);
    });

    test('Тест добавления нескольких ингредиентов в конструктор', () => {
      const newState = constructorSlice.reducer(initialState, {type: 'constructor/addIngredient', payload: ingredient1});
      const newState2 = constructorSlice.reducer(newState, {type: 'constructor/addIngredient', payload: ingredient2});
      expect(newState2).toEqual(expectedState4);
    });

    test('Тест изменения порядка ингредиентов в конструкторе', () => {
      const newState = constructorSlice.reducer(expectedState4, {type: 'constructor/moveIngredient', payload: {...ingredient1, id: "0", direction: 1}});
      expect(newState).toEqual(expectedState5);
    });

    test('Тест очистки конструктора', () => {
      const newState = constructorSlice.reducer(expectedState5, {type: 'constructor/reset'});
      expect(newState).toEqual(expectedState6);
    });

  });


  describe('Проверка экшенов санка', () => {

    test('Тест orderBurgerThunk, action: pending', () => {
      
      const fakeStore = configureStore({
        reducer: constructorSlice.reducer,
        preloadedState: initialStateFalse
      });

      const action = orderBurgerThunk.pending('fakeRequestId', orderIngredients1);
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.orderRequest).toBe(true);
    });

    test('Тест orderBurgerThunk, action: fulfilled', () => {
      
      const fakeStore = configureStore({
        reducer: constructorSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = orderBurgerThunk.fulfilled(orderResponse1, 'fakeRequestId', orderIngredients1);
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(order1);
    });

    test('Тест orderBurgerThunk, action: rejected', () => {
      
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: constructorSlice.reducer,
        preloadedState: initialStateTrue
      });

      const action = orderBurgerThunk.rejected(new Error('fakeError'), 'fakeRequestId', orderIngredients1);
      fakeStore.dispatch(action);

      const state = fakeStore.getState();
      expect(state.orderRequest).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('fakeError');
    });

  });


  describe('Проверка санка orderBurgerThunk', () => {  

    afterEach(() => {
      (api.orderBurgerApi as jest.Mock).mockRestore();
    })

    test('Тест санка orderBurgerThunk: pending', async () => {
      
      (api.orderBurgerApi as jest.Mock) = jest.fn((data: string[]) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(orderResponse1), 1000);
        });
      });

      const fakeStore = configureStore({
        reducer: constructorSlice.reducer,
        preloadedState: initialStateFalse
      });

      fakeStore.dispatch(orderBurgerThunk(orderIngredients1));

      const state = fakeStore.getState();
      expect(state.orderRequest).toBe(true);
      
    });

    test('Тест санка orderBurgerThunk: fulfilled', async () => {
      
      (api.orderBurgerApi as jest.Mock) = jest.fn((data: string[]) => Promise.resolve(orderResponse1));

      const fakeStore = configureStore({
        reducer: constructorSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(orderBurgerThunk(orderIngredients1));

      const state = fakeStore.getState();
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(order1);

    });

    test('Тест санка orderBurgerThunk: rejected', async () => {
      
      (api.orderBurgerApi as jest.Mock) = jest.fn((data: string[]) => Promise.reject('fakeError'));

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const fakeStore = configureStore({
        reducer: constructorSlice.reducer,
        preloadedState: initialStateTrue
      });

      await fakeStore.dispatch(orderBurgerThunk(orderIngredients1));

      const state = fakeStore.getState();
      expect(state.orderRequest).toBe(false);

      expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

    });

  });

});
