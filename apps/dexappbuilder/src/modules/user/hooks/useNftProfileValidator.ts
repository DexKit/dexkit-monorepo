// apps/dexappbuilder/src/modules/user/hooks/useNftProfileValidator.ts

import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuthUserQuery } from '.';

export interface ValidationResult {
  success: boolean;
  message: string;
  error?: string;
}

export function useNftProfileValidator(intervalSeconds = 300) {
  const { account, isActive } = useWeb3React();
  const userQuery = useAuthUserQuery();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const hasNftProfile = !!userQuery.data?.profileNft;

  const validateNow = async () => {
    if (!isActive || !account || !hasNftProfile) {
      return;
    }

    setIsValidating(true);
    try {
      const response = await axios.get('/api/user/validate-nft-profile');
      setValidationResult(response.data);
      
      if (!response.data.success) {
        userQuery.refetch();
      }
    } catch (error: any) {
      setValidationResult({
        success: false,
        message: 'Error validating NFT property',
        error: error?.message || 'Unknown error'
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (hasNftProfile) {
      validateNow();
    }
  }, [hasNftProfile, account]);

  useEffect(() => {
    if (!hasNftProfile || !isActive) {
      return;
    }

    const intervalId = setInterval(validateNow, intervalSeconds * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [hasNftProfile, isActive, intervalSeconds, account]);

  return {
    validationResult,
    isValidating,
    validateNow,
    hasNftProfile
  };
}