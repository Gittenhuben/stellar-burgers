import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';


export const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [formValid, setFormValid] = useState(true);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (formValid) {
      setError(null);
      
      registerUserApi({ email: email, name: userName, password: password })
        .then((data) => {
          localStorage.setItem('refreshToken', data.refreshToken);
          setCookie('accessToken', data.accessToken);
          dispatch({type: 'user/setLocalUser', payload: {userName: userName, email: email} });
          navigate('/', {replace: true});
        })
        .catch((err) => setError(err));
    }
  };

  return (
    <RegisterUI
      errorText={error?.message}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      formValid={formValid}
      setFormValid={setFormValid}
    />
  );
};
