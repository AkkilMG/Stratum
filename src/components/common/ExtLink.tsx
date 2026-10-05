import { openUrl } from '@tauri-apps/plugin-opener';
import type { ReactNode } from 'react';

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className='ext'
onClick={(e) => {
        e.preventDefault();
        openUrl(href).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
