import { FC, memo, PropsWithChildren } from 'react';

export const NotificationContainer: FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <div className="fixed right-4 top-4 w-80 z-50">
      <div className="bg-transparent p-2 gap-3 flex flex-wrap max-h-dvh overflow-y-auto rounded-lg  overflow-hidden">
          {children}
      </div>
    </div>
  );
});
