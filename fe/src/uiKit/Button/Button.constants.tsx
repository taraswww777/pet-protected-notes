import { ButtonVariant } from './Button.types.ts';

// 2. Маппинг вариантов на классы Tailwind
export const buttonVariantClasses = {
  [ButtonVariant.PRIMARY]: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  [ButtonVariant.SUCCESS]: 'text-white bg-green-500 hover:bg-green-700 focus:ring-green-500',
  [ButtonVariant.DANGER]: 'text-white bg-red-500 hover:bg-red-700 focus:ring-red-500',
  [ButtonVariant.WARNING]: 'text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
  [ButtonVariant.INFO]: 'text-white bg-cyan-500 hover:bg-cyan-700 focus:ring-cyan-500',
  [ButtonVariant.NEUTRAL]: 'text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500',
};

