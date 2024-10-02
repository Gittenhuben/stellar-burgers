import { getIngredientsApi } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';


export const getIngredientsThunk = createAsyncThunk(
  'getIngredientsThunk',
  async () => {
    try {
      return await getIngredientsApi();
    } catch (err) {
      console.log('Ошибка загрузки данных об ингредиентах с сервера');
      return await Promise.reject(`Ошибка: ${err}`);
    }
  }
)

export interface ingredientsState {
  ingredients: TIngredient[];
  isLoading: boolean
}

const initialState: ingredientsState = {
  ingredients: [],
  isLoading: true
}

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, action) => {
      state.ingredients = action.payload;
      state.isLoading = false;
    });
  },
});
