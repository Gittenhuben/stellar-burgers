import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch({type: 'constructor/moveIngredient', payload: {...ingredient, direction: 1}});
    };

    const handleMoveUp = () => {
      dispatch({type: 'constructor/moveIngredient', payload: {...ingredient, direction: -1}});
    };

    const handleClose = () => {
      dispatch({type: 'constructor/removeIngredient', payload: ingredient})
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
