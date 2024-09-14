import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { AppDispatch, useSelector, useDispatch } from '../../services/store';
import { getOrdersPersonalThunk } from '../../services/slices/orders-personal-slice';

export const ProfileOrders: FC = () => {
  
  const orders = useSelector((store) => store.ordersPersonalSlice.orders);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersPersonalThunk());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
