import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useEffect } from 'react';
import { useCoinLeagueUserAvatar } from '../hooks/useCoinLeagueUserAvatar';

interface CoinLeagueNavbarOverrideProps {
  appConfig: AppConfig;
  isPreview?: boolean;
}

export function CoinLeagueNavbarOverride({ appConfig, isPreview }: CoinLeagueNavbarOverrideProps) {
  const { handleUserAvatarClick } = useCoinLeagueUserAvatar();

  useEffect(() => {
    const overrideUserAvatarBehavior = () => {
      const navbar = document.querySelector('[role="banner"]') || document.querySelector('.MuiAppBar-root');
      if (!navbar) return;

      const userAvatarButtons = navbar.querySelectorAll('button[class*="ButtonBase"], button[class*="IconButton"]');

      userAvatarButtons.forEach((button) => {
        const avatar = button.querySelector('.MuiAvatar-root[src]') || button.querySelector('div[role="img"]');
        if (avatar && !button.hasAttribute('data-coinleague-override')) {
          button.setAttribute('data-coinleague-override', 'true');

          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUserAvatarClick();
          });
        }
      });
    };

    const timeoutId = setTimeout(overrideUserAvatarBehavior, 100);

    const observer = new MutationObserver(overrideUserAvatarBehavior);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [handleUserAvatarClick]);

  return null;
}