import { lazy } from 'react';

export const LoginPage = lazy(() => import('./LoginPage'));
export const RegisterPage = lazy(() => import('./RegisterPage'));
export const PasswordResetPage = lazy(() => import('./PasswordResetPage'));
export const TwoFAPage = lazy(() => import('./TwoFAPage.tsx'));
export const UserPage = lazy(() => import('./UserPage.tsx'));
