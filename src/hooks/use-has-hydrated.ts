import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** false saat render server / hydration pertama, true setelah client siap. */
export function useHasHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
