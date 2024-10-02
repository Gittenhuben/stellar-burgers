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
}

const initialState: constructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
}

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type == 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({...action.payload, id: String(state.constructorItems.ingredients.length)});
      }
    },
    removeIngredient: (state, action) => {
      if (action.payload.type == 'bun') {
        state.constructorItems.bun = null;
      } else {
        state.constructorItems.ingredients = state.constructorItems.ingredients
          .filter(elem => elem.id != action.payload.id)
          .map(elem => {
            return {...elem, id: String(Number(elem.id) + (Number(elem.id) > Number(action.payload.id) ? -1 : 0))}
          })
      }
    },
    reset: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    moveIngredient: (state, action) => {
      if (Number(action.payload.id) + action.payload.direction > -1 &&
          Number(action.payload.id) + action.payload.direction < state.constructorItems.ingredients.length) {
        state.constructorItems.ingredients = state.constructorItems.ingredients
          .map(elem => {
            if (Number(elem.id) == Number(action.payload.id)) return {...elem, id: 'a'};
            if (Number(elem.id) == Number(action.payload.id) + action.payload.direction) return {...elem, id: 'b'};
            return elem;
          })
          .map(elem => {
            if (elem.id == 'a') return {...elem, id: String(Number(action.payload.id) + action.payload.direction)};
            if (elem.id == 'b') return {...elem, id: String(Number(action.payload.id))};
            return elem;
          })
        state.constructorItems.ingredients.sort((p1, p2) => (Number(p1.id) - Number(p2.id)));
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
