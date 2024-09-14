import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { getUserThunk } from '../../services/slices/user-slice';
import { ProtectedRouteProps } from './type';


export const ProtectedRoute: FC<ProtectedRouteProps> = ({ loggedPrevent = false, children }) => {

  const user = useSelector((store) => store.userSlice.userName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationCurrent = location.pathname;
  const isLoading = useSelector((store) => store.userSlice.isLoadingGetUser);

  useEffect(() => {
    dispatch(getUserThunk());
  }, []);

  useEffect(() => {
    if(!isLoading) {
      if (loggedPrevent) {
        if (user!='') {
          navigate('/', {replace: true});
        }
      } else {
        if (user=='') {
          dispatch({type: 'user/setLocationWanted', payload: {locationWanted: locationCurrent}});
          navigate('/login');
        }
      }
    }
  }, [isLoading]);

  if (!isLoading && (loggedPrevent && user=='' || !loggedPrevent && user!='')) {
    return (<>{children}</>);
  } else {
    return (<Preloader />);
  }
};
