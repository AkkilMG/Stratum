import { Component, type ReactNode } from 'react';
import { tr } from '../../i18n';
import { Credits } from './Credits';

export class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) {
    return { err };
  }
  render() {
    if (!this.state.err) return this.props.children;
    const d = this.state.err.message + "\n" + (this.state.err.stack ?? "");
    return (
      <div className='wiz'>
        <div className='wscroll'>
          <section className='wmain'>
            <h2>{tr('ui.err_title')}</h2>
            <p className='lead sm'>{tr('ui.err_body')}</p>
            <div className='row'>
              <button className='primary' onClick={() => location.reload()}>
                {tr('ui.reload')}
              </button>
              <button className='ghostb' onClick={() => navigator.clipboard?.writeText(d)}>
                {tr('c.copy_details')}
              </button>
            </div>
            <Credits />
          </section>
        </div>
      </div>
    );
  }
}
