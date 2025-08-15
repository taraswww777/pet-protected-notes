import { EffectCallback, useEffect } from 'react';

/**
 * Хук для использования логики которая должна отработать только при монтировании компонента
 *
 * Сделан, чтобы избегать записи `useEffect(() => {...}), []);`
 *
 * @example
 * ```tsx
 * useMountEffect(() => {
 *   // Какой-то полезный код
 * })
 * ```
 */
export const useMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};
