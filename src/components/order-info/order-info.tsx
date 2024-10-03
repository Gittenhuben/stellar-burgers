import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation } from 'react-router-dom';
import { AppDispatch, useSelector, useDispatch } from '../../services/store';
import { getOrdersSingleThunk } from '../../services/slices/orders-single-slice/orders-single-slice';
import { useParams } from 'react-router';
import { OrderInfoProps } from './type';

export const OrderInfo: FC<OrderInfoProps> = ({title=false}) => {
  const location = useLocation();
  const orderNumberByLocation = Number(location.pathname.split('/').slice(-1)[0]);
  const ingredients = useSelector((store) => store.ingredientsSlice.ingredients);
  const ordersData = useSelector((store) => store.ordersSingleSlice.orders);
  const orderData = ordersData.find(elem => elem.number == orderNumberByLocation);

  const {number} = useParams();
  
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersSingleThunk(orderNumberByLocation));
  }, []);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} title={title ? "#"+number!.padStart(6, '0') : undefined} />;
};
