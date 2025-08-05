import { createContext } from 'react';
import { NotificationContextType } from './NotificationService.types.ts';

export const NotificationContext = createContext<NotificationContextType | null>(null);
