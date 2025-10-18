import Navbar from '@dexkit/ui/components/Navbar';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';

interface CoinLeagueNavbarProps {
  appConfig: AppConfig;
  isPreview?: boolean;
}

export function CoinLeagueNavbar({ appConfig, isPreview }: CoinLeagueNavbarProps) {
  // Override del componente Navbar original para usar nuestro Avatar personalizado
  return (
    <div>
      {/* Aquí podríamos crear un wrapper personalizado, pero por ahora vamos a usar el Navbar original */}
      <Navbar appConfig={appConfig} isPreview={isPreview} />
    </div>
  );
}
