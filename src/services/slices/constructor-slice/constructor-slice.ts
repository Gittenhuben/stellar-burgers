import { orderBurgerApi } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TConstructorIngredient, TIngredient } from '../../../utils/types';


export const orderBurgerThunk = createAsyncThunk(
  'orderBurgerThunk',
  async (data: string[]) => {
    try {
      return await orderBurgerApi(data);
    } catch (err) {
      console.log('Ошибка выгрузки данных заказа на сервер');
      return await Promise.reject(`Ошибка: ${err}`);
    }
  }
)

export interface constructorState {
  constructorItems: {
    bun: TIngredient | null,
    ingredients: TConstructorIngredient[]
  },
  orderRequest: boolean,
  orderModalData: TOrder | null,
  idCounter: number
}

const initialState: constructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  idCounter: 0
}

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type == 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({...action.payload, id: String(state.idCounter++)});
      }
    },
    removeIngredient: (state, action) => {
      if (action.payload.type == 'bun') {
        state.constructorItems.bun = null;
      } else {
        state.constructorItems.ingredients = state.constructorItems.ingredients
          .filter(elem => elem.id != action.payload.id)
      }
    },
    reset: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    moveIngredient: (state, action) => {
      const elementIndex = state.constructorItems.ingredients.findIndex(elem => elem.id == action.payload.id);
      if (elementIndex + action.payload.direction > -1 &&
          elementIndex + action.payload.direction < state.constructorItems.ingredients.length) {
        const temp = state.constructorItems.ingredients[elementIndex];
        state.constructorItems.ingredients[elementIndex] = state.constructorItems.ingredients[elementIndex + action.payload.direction];
        state.constructorItems.ingredients[elementIndex + action.payload.direction] = temp;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurgerThunk.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(orderBurgerThunk.rejected, (state, action) => {
      state.orderRequest = false;
      console.log(action.error.message);
    });
    builder.addCase(orderBurgerThunk.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload.order;
    });
  }
});
