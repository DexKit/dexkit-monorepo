import { DexkitApiProvider } from '@dexkit/core/providers';
import { SiteContext } from '@dexkit/ui/providers/SiteProvider';
import React from 'react';
import { myAppsApi } from 'src/services/whitelabel';

export interface SiteWizardProviderProps {
  children: React.ReactNode;
  siteId?: number;
}

export default function SiteWizardProvider({
  children,
  siteId,
}: SiteWizardProviderProps) {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <SiteContext.Provider value={{ siteId }}>{children}</SiteContext.Provider>
    </DexkitApiProvider.Provider>
  );
}
