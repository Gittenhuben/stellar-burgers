import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsSlice } from './slices/ingredients-slice/ingredients-slice';
import { feedsSlice } from './slices/feeds-slice/feeds-slice';
import { constructorSlice } from './slices/constructor-slice/constructor-slice';
import { ordersPersonalSlice } from './slices/orders-personal-slice/orders-personal-slice';
import { ordersSingleSlice } from './slices/orders-single-slice/orders-single-slice';
import { userSlice } from './slices/user-slice/user-slice';

export const rootReducer = combineReducers({
  ingredientsSlice: ingredientsSlice.reducer,
  feedsSlice: feedsSlice.reducer,
  constructorSlice: constructorSlice.reducer,
  ordersPersonalSlice: ordersPersonalSlice.reducer,
  ordersSingleSlice: ordersSingleSlice.reducer,
  userSlice: userSlice.reducer
});
