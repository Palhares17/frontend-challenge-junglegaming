import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';
import { GoogleMark } from './google-mark';

export function SocialAuthOptions({
  onSocial,
  register = false,
}: {
  onSocial: (provider: 'google' | 'facebook') => void;
  register?: boolean;
}) {
  const desktop = register
    ? figmaAssets.registerDesktop
    : figmaAssets.loginDesktop;
  const mobile = register
    ? figmaAssets.registerMobile
    : figmaAssets.loginMobile;
  return (
    <section className="auth-social" aria-label="Outras formas de entrar">
      <div className="auth-social-divider">
        <span>
          <img
            src={desktop.line7.src}
            width={desktop.line7.width}
            height={desktop.line7.height}
            alt=""
          />
        </span>
        <p>Ou continue com</p>
        <span>
          <img
            src={desktop.line8.src}
            width={desktop.line8.width}
            height={desktop.line8.height}
            alt=""
          />
        </span>
      </div>
      <div className="auth-social-buttons">
        <button type="button" onClick={() => onSocial('google')}>
          <GoogleMark />
          Continuar com Google
        </button>
        <button type="button" onClick={() => onSocial('facebook')}>
          <span className="hidden lg:inline">
            <Icon asset={desktop.facebook1} />
          </span>
          <span className="lg:hidden">
            <Icon asset={mobile.facebook1} />
          </span>
          Continuar com Facebook
        </button>
      </div>
    </section>
  );
}
