import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { deleteCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';


export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutApi()
      .then(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        dispatch({type: 'user/setLocalUser', payload: {userName: '', email: ''} });
        navigate('/login', {state: {from: ''}});
      })
      .catch(() => {
        console.log('Ошибка логаута');
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
