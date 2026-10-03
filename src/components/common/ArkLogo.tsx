import arkLight from '../../assets/arkynox-light.png';
import arkDark from '../../assets/arkynox-studio-dark.svg';

/** Arkynox company logo, light or dark version depending on the active theme. */
export function ArkLogo({ height = 36 }: { height?: number }) {
  return (
    <span className='arklogo'>
      <img className='ark ark-l' style={{ height }} src={arkLight} alt='Arkynox' />
      <img className='ark ark-d' style={{ height }} src={arkDark} alt='Arkynox' />
    </span>
  );
}
