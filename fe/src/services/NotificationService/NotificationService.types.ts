export enum NotificationType {
  success = 'success',
  danger = 'danger',
  info = 'info',
  warning = 'warning'
}


interface ShowNotificationParams {
  /** По умолчанию NotificationType.info */
  type: NotificationType
  /** По умолчанию true */
  closeable: boolean;
}

export interface NotificationItem extends ShowNotificationParams {
  id: string;
  message: string;
}

export interface NotificationContextType {
  showNotification: (message: string, params?: Partial<ShowNotificationParams>) => void;
}
