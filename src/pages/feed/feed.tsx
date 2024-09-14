import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { AppDispatch, useSelector, useDispatch } from '../../services/store';
import { getFeedsThunk } from '../../services/slices/feeds-slice';


export const Feed: FC = () => {
  
  const orders = useSelector(store => store.feedsSlice.ordersData.orders);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedsThunk());
  }, []);

  function handleGetFeeds() {
    dispatch(getFeedsThunk());
  }

  return (
    <>{(!orders.length) ? (<Preloader />) : (<FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />)}</>
  )
};
