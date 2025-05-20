import { FC, PropsWithChildren } from 'react';
import { Navbar } from './NavBar.tsx';

export const PageTemplate: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Navbar />
    <>{children}</>
  </>
)
