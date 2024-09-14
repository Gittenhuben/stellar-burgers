import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const userName = useSelector((store) => store.userSlice.userName);
  const location = useLocation();
  const alternativePrimeLocation = location.pathname.split('/')[1] == 'ingredients';

  return (
    <AppHeaderUI userName={userName} alternativePrimeLocation={alternativePrimeLocation} />
  )
};
