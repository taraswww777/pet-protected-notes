import { NotificationType, NotificationItem } from './NotificationService.types.ts';
import { memo } from 'react';

interface NotificationCardProps {
  notification: NotificationItem;
  onClose: (id: string) => void;
}

const notificationStyles: Record<NotificationType, {
  icon: string,
  bg: string,
  text: string,
}> = {
  [NotificationType.success]: { icon: 'mdi-light--check-circle', bg: 'bg-green-100', text: 'text-green-800' },
  [NotificationType.danger]: { icon: 'mdi-light--alert-circle', bg: 'bg-red-100', text: 'text-red-800' },
  [NotificationType.warning]: { icon: 'mdi-light--alert', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [NotificationType.info]: { icon: 'mdi-light--information', bg: 'bg-blue-100', text: 'text-blue-800' },
};


export const NotificationCard = memo(({ notification, onClose }: NotificationCardProps) => {
  const { icon, bg, text } = notificationStyles[notification.type];

  return (
    <div className={`${bg} ${text} w-full p-4 rounded-lg shadow-md flex items-start`}>
      <span className={`iconify mr-3 mt-0.5 flex-shrink-0 text-2xl ${icon}`}></span>
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
      {notification.closeable ? (
        <button
          onClick={() => onClose(notification.id)}
          className="text-gray-500 hover:text-gray-700 ml-2"
        >
          <span className={"iconify mdi--close text-lg"}></span>
        </button>
      ) : ''}
    </div>
  );
});
