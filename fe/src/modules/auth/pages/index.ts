import { lazy } from 'react';

export const LoginPage = lazy(() => import('./LoginPage'));
export const RegisterPage = lazy(() => import('./RegisterPage'));
export const TwoFAPage = lazy(() => import('./TwoFAPage.tsx'));
export const UserPage = lazy(() => import('./UserPage.tsx'));
export const ChangePasswordPage = lazy(() => import('./ChangePasswordPage.tsx'));
export const ForgotPasswordPage = lazy(() => import('./ForgotPasswordPage.tsx'));
export const ResetPasswordPage = lazy(() => import('./ResetPasswordPage.tsx'));
export const EditUserPage = lazy(() => import('./EditUserPage.tsx'));
