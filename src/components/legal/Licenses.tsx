import { useEffect, useState } from 'react';
import { dateOf, useI18n } from '../../i18n';
import { ExtLink } from '../common';

type Lic = { generated: string; packages: { n: string; v: string; l: string; r: string; e: string; f: string[] }[]; texts: Record<string, string> };

export function Licenses() {
  const { t } = useI18n();
  const [d, setD] = useState<Lic | null>(null);
  const [q, setQ] = useState('');
  const [more, setMore] = useState(80);
  useEffect(() => {
    import('../../licenses.json').then((m) => setD(m.default as unknown as Lic));
  }, []);
  if (!d) return <p className='hint'>{t('lic.loading')}</p>;
  const f = d.packages.filter((p) => (p.n + ' ' + p.l).toLowerCase().includes(q.toLowerCase()));
  const kinds = new Map<string, number>();
  d.packages.forEach((p) => kinds.set(p.l, (kinds.get(p.l) ?? 0) + 1));
  const top = [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <>
      <p>{t('lic.intro', { n: d.packages.length, d: dateOf(d.generated) })}</p>
      <p className='chips small'>
        {top.map(([l, n]) => (
          <span className='badge' key={l}>
            {l} ?? {n}
          </span>
        ))}
      </p>
      <input className='field' type='search' placeholder={t('lic.search')} value={q} onChange={(e) => { setQ(e.target.value); setMore(80); }} aria-label={t('lic.search')} />
      <div className='lics'>
        {f.slice(0, more).map((p) => (
          <details key={p.e + p.n + p.v}>
            <summary>
              <b>{p.n}</b> <span>{p.v}</span>
              <em className='badge'>{p.l}</em>
            </summary>
            {/^https?:\/\//.test(p.r) && (
              <p>
                <ExtLink href={p.r}>{p.r}</ExtLink>
              </p>
            )}
            <pre>{p.f.length ? p.f.map((h) => d.texts[h]).join('\n\n---\n\n') : t('lic.nofile')}</pre>
          </details>
        ))}
      </div>
      {f.length > more && (
        <button className='ghostb' onClick={() => setMore(more + 200)}>
          {t('lic.more', { n: f.length - more })}
        </button>
      )}
      {f.length === 0 && <p className='hint'>{t('lic.none')}</p>}
    </>
  );
}
