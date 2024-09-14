import { ReactNode } from 'react';

export type ProtectedRouteProps = {
  loggedPrevent?: boolean;
  children?: ReactNode;
};