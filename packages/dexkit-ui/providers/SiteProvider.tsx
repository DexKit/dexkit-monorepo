import React from "react";

export const SiteContext = React.createContext<{
  siteId?: number;
  slug?: string;
}>({});

export interface SiteProviderProps {
  siteId?: number;
  children: React.ReactNode;
  slug?: string;
}

export default function SiteProvider({
  siteId,
  slug,
  children,
}: SiteProviderProps) {
  return (
    <SiteContext.Provider value={{ siteId, slug }}>
      {children}
    </SiteContext.Provider>
  );
}
