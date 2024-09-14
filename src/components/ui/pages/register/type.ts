import { Dispatch, SetStateAction, RefObject } from 'react';
import { PageUIProps } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  formValid: boolean;
  setPassword: Dispatch<SetStateAction<string>>;
  setUserName: Dispatch<SetStateAction<string>>;
  setFormValid: Dispatch<SetStateAction<boolean>>;
};
