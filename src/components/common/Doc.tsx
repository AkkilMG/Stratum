import { Fragment } from 'react';
import { ExtLink } from './ExtLink';

const LINK = /(https?:\/\/[^\s,)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
const linkify = (s: string) => s.split(LINK).map((p, i) => (i % 2 ? <ExtLink key={i} href={p.includes('@') && !p.startsWith('http') ? `mailto:${p}` : p}>{p}</ExtLink> : <Fragment key={i}>{p}</Fragment>));

/** Renders the small markdown subset used by the legal documents, with clickable links and emails. */
export function Doc({ text }: { text: string }) {
  return (
    <div className='doc'>
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((b, i) => {
          if (b.startsWith('## ')) return <h3 key={i}>{b.slice(3)}</h3>;
          const l = b.split('\n');
          if (l.every((x) => x.startsWith('- '))) return <ul key={i}>{l.map((x, k) => <li key={k}>{linkify(x.slice(2))}</li>)}</ul>;
          return <p key={i}>{linkify(b)}</p>;
        })}
    </div>
  );
}
