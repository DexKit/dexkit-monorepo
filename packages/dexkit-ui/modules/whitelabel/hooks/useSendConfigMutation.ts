import { myAppsApi } from '@dexkit/ui/constants/api';
import { ConfigResponse } from '@dexkit/ui/modules/wizard/types/config';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface SendConfigVariables {
  config: string;
  slug: string;
}

export interface UseSendConfigMutationProps {
  options?: UseMutationOptions<ConfigResponse, Error, SendConfigVariables>;
}

export function useSendConfigMutation({
  options,
}: UseSendConfigMutationProps = {}): UseMutationResult<
  ConfigResponse,
  Error,
  SendConfigVariables
> {
  return useMutation<ConfigResponse, Error, SendConfigVariables>({
    mutationFn: async ({ config, slug }) => {
      try {
        const response = await myAppsApi.post('/site/create-site', {
          config,
          slug,
          type: 'MARKETPLACE'
        });
        
        return response.data;
      } catch (error: unknown) {
        console.error("Error updating config:", error);
        
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.error("Error response:", {
              status: axiosError.response.status,
              statusText: axiosError.response.statusText,
              data: axiosError.response.data,
              headers: axiosError.response.headers
            });
            
            const errorData = axiosError.response.data as { message?: string } || {};
            const errorMessage = errorData.message || 
              `Server error: ${axiosError.response.status} ${axiosError.response.statusText}`;
            throw new Error(errorMessage);
          } else if (axiosError.request) {
            console.error("Error request:", axiosError.request);
            throw new Error("Network error: No connection to the server");
          } else {
            console.error("Error details:", axiosError.message);
            throw new Error(`Error updating config: ${axiosError.message}`);
          }
        } else {
          throw new Error("Unknown error updating config");
        }
      }
    },
    ...options,
  });
} 