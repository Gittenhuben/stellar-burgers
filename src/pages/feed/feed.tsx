import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedsThunk } from '../../services/slices/feeds-slice/feeds-slice';


export const Feed: FC = () => {
  
  const orders = useSelector(store => store.feedsSlice.ordersData.orders);

  const dispatch = useDispatch();
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
