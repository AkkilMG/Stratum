import { useEffect, useRef, type ReactNode } from 'react';
import { useI18n } from '../../i18n';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,summary,[tabindex]:not([tabindex=\"-1\"])')].filter(
          (x) => !x.hasAttribute('disabled')
        );
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener('keydown', k, true);
    return () => {
      window.removeEventListener('keydown', k, true);
      prev?.focus();
    };
  }, []);
  return (
    <div className='cmdbg' onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'modal' + (wide ? ' wide' : '')} role='dialog' aria-modal='true' aria-label={title} tabIndex={-1} ref={ref}>
        <header>
          <h3>{title}</h3>
          <button className='icon' onClick={onClose} aria-label={t('c.close')}>
            ???
          </button>
        </header>
        <div className='mbody'>{children}</div>
      </div>
    </div>
  );
}
