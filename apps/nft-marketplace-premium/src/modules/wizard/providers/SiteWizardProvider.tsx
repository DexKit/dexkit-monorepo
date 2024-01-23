import React from 'react';

export const SiteContext = React.createContext<{ siteId?: number }>({});

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
