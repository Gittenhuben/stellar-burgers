import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { orderBurgerThunk } from '../../services/slices/constructor-slice';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';


export const BurgerConstructor: FC = () => {
  
  const constructorItems = useSelector((store) => store.constructorSlice.constructorItems);
  const orderRequest = useSelector((store) => store.constructorSlice.orderRequest);
  const orderModalData = useSelector((store) => store.constructorSlice.orderModalData);
  const user = useSelector((store) => store.userSlice.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background?.pathname;

  function getIngredientsList() {
    const ingredientsList: string[] = [];
    if (constructorItems.bun) ingredientsList.push(constructorItems.bun._id);
    constructorItems.ingredients.forEach(ingredient => ingredientsList.push(ingredient._id));
    if (constructorItems.bun) ingredientsList.push(constructorItems.bun._id);
    return ingredientsList
  }

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      if (constructorItems.bun && !orderRequest) {
        dispatch(orderBurgerThunk(getIngredientsList()));
      }  
    }  
  };

  const closeOrderModal = () => {
    dispatch({type: 'constructor/reset'});
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );

};
