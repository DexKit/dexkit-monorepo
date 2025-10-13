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
    // Override del comportamiento del ícono de usuario en el DOM
    const overrideUserAvatarBehavior = () => {
      // Buscar botones que contienen avatares de usuario en el navbar
      const navbar = document.querySelector('[role="banner"]') || document.querySelector('.MuiAppBar-root');
      if (!navbar) return;

      // Buscar botones que contienen avatares de usuario
      const userAvatarButtons = navbar.querySelectorAll('button[class*="ButtonBase"], button[class*="IconButton"]');

      userAvatarButtons.forEach((button) => {
        // Verificar si el botón contiene un Avatar de usuario
        const avatar = button.querySelector('.MuiAvatar-root[src]') || button.querySelector('div[role="img"]');
        if (avatar && !button.hasAttribute('data-coinleague-override')) {
          // Marcar como ya procesado
          button.setAttribute('data-coinleague-override', 'true');

          // Agregar nuestro event listener personalizado
          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUserAvatarClick();
          });
        }
      });
    };

    // Ejecutar después de que el componente se monte
    const timeoutId = setTimeout(overrideUserAvatarBehavior, 100);

    // También ejecutar cuando el DOM cambie
    const observer = new MutationObserver(overrideUserAvatarBehavior);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [handleUserAvatarClick]);

  // No renderizamos nada, solo modificamos el comportamiento existente
  return null;
}
