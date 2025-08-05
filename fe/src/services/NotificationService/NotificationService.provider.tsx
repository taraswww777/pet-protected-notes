import React, { useState } from 'react';
import { NotificationContextType, NotificationItem, NotificationType } from './NotificationService.types';
import { NotificationContext } from './NotificationService.context';
import { v4 as uuidv4 } from 'uuid';
import { NotificationCard } from './NotificationCard.tsx';
import { NotificationContainer } from './NotificationContainer.tsx';
import { SECOND_IN_MS } from '../../constants/common.ts';


export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);

  const showNotification: NotificationContextType['showNotification'] = (message, {
    type = NotificationType.info,
    closeable = true,
  } = {}) => {
    const newNotification: NotificationItem = {
      id: uuidv4(),
      message,
      type,
      closeable,
    };


    setNotificationList((prevValueNotificationList) => [...prevValueNotificationList, newNotification]);

    if (newNotification.closeable) {
      setTimeout(() => {
        onCloseItemNotification(newNotification.id)
      }, SECOND_IN_MS * 5)
    }
  };

  const onCloseItemNotification = (notificationId: string) => {
    setNotificationList((prevNotificationList) => prevNotificationList.filter((notification) => notification.id !== notificationId));
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {Boolean(notificationList.length) && (
        <NotificationContainer>
          {notificationList.map((notificationItem) => (
            <NotificationCard
              key={notificationItem.id}
              notification={notificationItem}
              onClose={onCloseItemNotification}
            />
          ))}
        </NotificationContainer>
      )}
    </NotificationContext.Provider>
  );
};
