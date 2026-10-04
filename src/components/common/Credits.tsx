import { APP } from '../../config/legal';
import { useI18n } from '../../i18n';
import { ArkLogo } from './ArkLogo';
import { ExtLink } from './ExtLink';

export function Credits({ logo }: { logo?: boolean }) {
  const { t } = useI18n();
  return (
    <p className='credits'>
      {logo && <ArkLogo height={28} />}
      <span>
        {t('cr.product')} <ExtLink href={APP.site}>Arkynox</ExtLink> | {t('cr.dev')} {APP.developer} (<ExtLink href={APP.github}>@AkkilMG</ExtLink>)
      </span>
    </p>
  );
}
