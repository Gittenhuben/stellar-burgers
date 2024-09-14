import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation } from 'react-router';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const ingredientIdByLocation = location.pathname.split('/').slice(-1)[0];
  const ingredients = useSelector((store) => store.ingredientsSlice.ingredients);
  const ingredientData = ingredients.find(elem => elem._id == ingredientIdByLocation);
  
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
