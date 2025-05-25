import { SiteContext } from '@dexkit/ui/providers/SiteProvider';
import React from 'react';

export interface SiteWizardProviderProps {
  children: React.ReactNode;
  siteId?: number;
}

export default function SiteWizardProvider({
  children,
  siteId,
}: SiteWizardProviderProps) {
  return (
    <SiteContext.Provider value={{ siteId }}>{children}</SiteContext.Provider>
  );
}
