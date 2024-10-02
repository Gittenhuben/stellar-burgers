import { describe, expect, test } from '@jest/globals';
import { rootReducer } from './root-reducer';
import { ingredientsSlice } from './slices/ingredients-slice/ingredients-slice';
import { feedsSlice } from './slices/feeds-slice/feeds-slice';
import { constructorSlice } from './slices/constructor-slice/constructor-slice';
import { ordersPersonalSlice } from './slices/orders-personal-slice/orders-personal-slice';
import { ordersSingleSlice } from './slices/orders-single-slice/orders-single-slice';
import { userSlice } from './slices/user-slice/user-slice';


describe('Проверка корневого редьюсера', () => {
  
  const expectedState = {
    constructorSlice: constructorSlice.getInitialState(),
    feedsSlice: feedsSlice.getInitialState(),
    ingredientsSlice: ingredientsSlice.getInitialState(),
    ordersPersonalSlice: ordersPersonalSlice.getInitialState(),
    ordersSingleSlice: ordersSingleSlice.getInitialState(),
    userSlice: userSlice.getInitialState()
  }
  
  test('Тест инициализации корневого редьюсера', () => {
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(newState).toEqual(expectedState);
  });

});
