import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';


export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locationWanted = useSelector((store) => store.userSlice.locationWanted);
  
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    loginUserApi({ email: email, password: password })
      .then((data) => {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        dispatch({type: 'user/setLocalUser', payload: {userName: data.user.name, email: data.user.email} });
        setPassword('');
        if (locationWanted) {
          navigate(locationWanted, {replace: true});
        } else {
          navigate('/', {replace: true});
        }
      })
      .catch((err) => setError(err));
  };

  return (
    <LoginUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};


