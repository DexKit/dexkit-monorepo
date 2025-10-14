import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useEffect } from 'react';
import { useCoinLeagueConnectWallet } from '../hooks/useCoinLeagueConnectWallet';

interface CoinLeagueNavbarOverrideProps {
  appConfig: AppConfig;
  isPreview?: boolean;
}

export function CoinLeagueNavbarOverride({ appConfig, isPreview }: CoinLeagueNavbarOverrideProps) {
  const { handleUserAvatarClick } = useCoinLeagueConnectWallet();

  useEffect(() => {
    const overrideUserAvatarBehavior = () => {
      const navbar = document.querySelector('[role="banner"]') || document.querySelector('.MuiAppBar-root');
      if (!navbar) return;

      const userAvatarButtons = navbar.querySelectorAll('button[class*="ButtonBase"], button[class*="IconButton"], button[class*="MuiButtonBase"]');

      userAvatarButtons.forEach((button) => {
        const avatar = button.querySelector('.MuiAvatar-root[src]') ||
          button.querySelector('div[role="img"]') ||
          button.querySelector('.MuiAvatar-root');

        const isAvatarButton = button.classList.contains('MuiButtonBase-root') &&
          (button.querySelector('.MuiAvatar-root') ||
            button.getAttribute('aria-label')?.includes('profile') ||
            button.getAttribute('aria-label')?.includes('user'));

        if ((avatar || isAvatarButton) && !button.hasAttribute('data-coinleague-override')) {
          button.setAttribute('data-coinleague-override', 'true');
          button.addEventListener('click', (e) => {
            console.log('Coin League: Avatar clicked, redirecting to profile');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            handleUserAvatarClick();
          }, { capture: true });
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
