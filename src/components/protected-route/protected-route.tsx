import { FC } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { getUserThunk } from '../../services/slices/user-slice/user-slice';
import { ProtectedRouteProps } from './type';
import { getCookie } from '../../utils/cookie';


export const ProtectedRoute: FC<ProtectedRouteProps> = ({ loggedPrevent = false, children }) => {

  const user = useSelector((store) => store.userSlice.userName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationCurrent = location.pathname;
  const locationState = location.state;
  const isLoading = useSelector((store) => store.userSlice.isLoadingGetUser);
  
  useEffect(() => {
    if (getCookie('accessToken')) {
      dispatch(getUserThunk());
    } else {
      dispatch({type: 'user/reset'});
      console.log('Нет куки');
    }
  }, []);

  useEffect(() => {
    if(!isLoading) {
      if (loggedPrevent) {
        if (user!='') {
          navigate('/', {replace: true});
        }
      } else {
        if (user=='') {
          navigate('/login', {state: {from: locationCurrent}} );
        }
      }
    }
  }, [isLoading]);

  if (!isLoading && (loggedPrevent && user=='' || !loggedPrevent && user!='')) {
    return (<>{children}</>);
  }

  return (<Preloader />);
};
