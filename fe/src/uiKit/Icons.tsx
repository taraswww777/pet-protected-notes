import { FC, HTMLAttributes } from 'react';

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
}

export const DashboardIcon: FC<IconProps> = ({ className, ...props }) => (
  <span className={`iconify mdi-light--view-dashboard text-2xl ${className}`} {...props} />
);

export const PencilIcon: FC<IconProps> = ({ className, ...props }) => (
  <span className={`iconify mdi-light--pencil text-2xl ${className}`} {...props} />
);

export const TrashIcon: FC<IconProps> = ({ className, ...props }) => (
  <span className={`iconify mdi--trash-can text-2xl ${className}`} {...props} />
);

export const CogIcon: FC<IconProps> = ({ className, ...props }) => (
  <span className={`iconify mdi-light--cog text-2xl ${className}`} {...props} />
);

export const PlusIcon: FC<IconProps> = ({ className, ...props }) => (
  <span className={`iconify mdi-light--plus text-2xl ${className}`} {...props} />
);

export const UsersIcon: FC<IconProps> = ({ className, ...props }) => (
  <span className={`iconify mdi--account-group text-2xl ${className}`} {...props} />
);

export const XMarkIcon: FC<IconProps> = ({ className = '', ...props }) => (
  <span
    className={`iconify mdi--close text-2xl ${className}`}
    {...props}
  />
);
