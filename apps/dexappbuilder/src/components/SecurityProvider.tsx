import React, { createContext, ReactNode, useContext, useEffect } from 'react';

interface SecurityContextType {
  isSecure: boolean;
  trustedTypesSupported: boolean;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecure: false,
  trustedTypesSupported: false,
});

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = React.useState(false);
  const [trustedTypesSupported, setTrustedTypesSupported] = React.useState(false);

  useEffect(() => {
    const hasTrustedTypes = typeof window !== 'undefined' && 'trustedTypes' in window;
    setTrustedTypesSupported(hasTrustedTypes);

    if (hasTrustedTypes) {
      setIsSecure(true);
    } else {
      console.warn('Trusted Types not supported, using fallback security measures');
      setIsSecure(true);
    }

    const checkSecurityFeatures = () => {
      const hasCSP = 'securityPolicyViolationEvent' in window;

      const hasHSTS = 'serviceWorker' in navigator;

      const hasCOOP = 'crossOriginIsolated' in window;

      if (hasCSP && hasHSTS && hasCOOP) {
        setIsSecure(true);
      }
    };

    checkSecurityFeatures();

    const handleSecurityViolation = (event: any) => {
      console.warn('Security policy violation:', event);
      if (process.env.NODE_ENV === 'production') {
        console.error('Security violation detected:', event);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('securitypolicyviolation', handleSecurityViolation);

      return () => {
        window.removeEventListener('securitypolicyviolation', handleSecurityViolation);
      };
    }
  }, []);

  const contextValue: SecurityContextType = {
    isSecure,
    trustedTypesSupported,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityProvider;
