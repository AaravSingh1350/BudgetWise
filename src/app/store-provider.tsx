'use client';

import { StoreProvider as Provider } from '@/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
