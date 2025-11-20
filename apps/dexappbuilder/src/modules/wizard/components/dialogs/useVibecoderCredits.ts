import { DexkitApiProvider } from '@dexkit/core/providers';
import { useSubscription } from '@dexkit/ui/hooks/payments';
import { AI_MODEL } from '@dexkit/ui/types/ai';
import Decimal from 'decimal.js';
import { useContext, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  calculateTokenCost,
  FREE_PROMPTS_PER_DAY,
  getEstimatedCostPerPrompt,
} from './vibecoder-credits';

export interface DailyFreePromptsResponse {
  usedToday: number;
  remainingToday: number;
  lastUsedDate: string | null;
}

const VIBECODER_FREE_PROMPTS_QUERY = 'VIBECODER_FREE_PROMPTS_QUERY';

export function useDailyFreePrompts() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery<DailyFreePromptsResponse>(
    [VIBECODER_FREE_PROMPTS_QUERY],
    async () => {
      try {
        const response = await instance?.get('/ai/vibecoder/free-prompts');
        return response?.data || {
          usedToday: 0,
          remainingToday: FREE_PROMPTS_PER_DAY,
          lastUsedDate: null,
        };
      } catch (error) {
        return {
          usedToday: 0,
          remainingToday: FREE_PROMPTS_PER_DAY,
          lastUsedDate: null,
        };
      }
    },
    {
      refetchInterval: 30000,
      retry: false,
    }
  );
}

export function useGenerateVibecoderSections() {
  const { instance } = useContext(DexkitApiProvider);
  const subscriptionQuery = useSubscription();

  return useMutation(
    async ({
      prompt,
      model,
      siteId,
      chatId,
      intent,
      pageKey,
    }: {
      prompt: string;
      model: AI_MODEL;
      siteId?: number;
      chatId?: number;
      intent?: 'generate-sections' | 'generate-logo' | 'generate-seo';
      pageKey?: string;
    }) => {
      const response = await instance?.post('/ai/vibecoder/generate-sections', {
        prompt,
        model,
        siteId,
        chatId,
        intent,
        pageKey,
      });
      return response?.data;
    },
    {
      onSuccess: async () => {
        await subscriptionQuery.refetch();
      },
    }
  );
}

export function useVibecoderCredits() {
  const subscriptionQuery = useSubscription();
  const freePromptsQuery = useDailyFreePrompts();

  const credits = useMemo(() => {
    if (subscriptionQuery.data) {
      return new Decimal(subscriptionQuery.data?.creditsAvailable)
        .minus(new Decimal(subscriptionQuery.data?.creditsUsed))
        .toNumber();
    }
    return 0;
  }, [subscriptionQuery.data]);

  const freePromptsRemaining = useMemo(() => {
    if (freePromptsQuery.data) {
      return freePromptsQuery.data.remainingToday;
    }
    return FREE_PROMPTS_PER_DAY;
  }, [freePromptsQuery.data]);

  const freePromptsUsedToday = useMemo(() => {
    if (freePromptsQuery.data) {
      return freePromptsQuery.data.usedToday;
    }
    return 0;
  }, [freePromptsQuery.data]);

  const getEstimatedCost = (model: AI_MODEL): number => {
    return getEstimatedCostPerPrompt(model);
  };

  const calculateRealCost = (
    model: AI_MODEL,
    inputTokens: number,
    outputTokens: number,
  ): number => {
    return calculateTokenCost(model, inputTokens, outputTokens);
  };

  const hasEnoughCredits = (estimatedCost: number): boolean => {
    return credits >= estimatedCost;
  };

  return {
    credits,
    freePromptsRemaining,
    freePromptsUsedToday,
    getEstimatedCost,
    calculateRealCost,
    hasEnoughCredits,
    isLoading: subscriptionQuery.isLoading || freePromptsQuery.isLoading,
    refetch: async () => {
      await Promise.all([
        subscriptionQuery.refetch(),
        freePromptsQuery.refetch(),
      ]);
    },
  };
}

