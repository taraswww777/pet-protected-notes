import { FC, memo, PropsWithChildren } from 'react';

export const NotificationContainer: FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <div className="fixed right-4 top-4 w-80 z-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 max-h-dvh overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
});
