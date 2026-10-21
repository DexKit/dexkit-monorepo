import { DexkitApiProvider } from '@dexkit/core/providers';
import { useSubscription } from '@dexkit/ui/hooks/payments';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { AI_MODEL } from '@dexkit/ui/types/ai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

export interface VibecoderChat {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface VibecoderChatResponse {
  message: string;
  changes?: Partial<AppConfig>;
  suggestions?: string[];
  requiresConfirmation: boolean;
  requiresVariantSelection?: {
    sectionType: string;
    availableVariants: string[];
  };
  chatId: number;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  logoUrls?: string[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    pageKey: string;
  };
}

const VIBECODER_CHATS_QUERY = 'VIBECODER_CHATS_QUERY';

export function useVibecoderChats() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery<VibecoderChat[]>(
    [VIBECODER_CHATS_QUERY],
    async () => {
      try {
        const response = await instance?.get('/ai/vibecoder/chats');
        return response?.data || [];
      } catch (error) {
        return [];
      }
    },
    {
      retry: false,
    }
  );
}

export function useCreateVibecoderChat() {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();

  return useMutation<VibecoderChat, Error, string | undefined>(
    async (name) => {
      const response = await instance?.post('/ai/vibecoder/chats', {
        name: name || 'New Chat',
      });
      return response?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([VIBECODER_CHATS_QUERY]);
      },
    }
  );
}

export function useUpdateVibecoderChat() {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, name }: { id: number; name: string }) => {
      const response = await instance?.put(`/ai/vibecoder/chats/${id}`, {
        name,
      });
      return response?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([VIBECODER_CHATS_QUERY]);
      },
    }
  );
}

export function useDeleteVibecoderChat() {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();

  return useMutation(
    async (id: number) => {
      const response = await instance?.delete(`/ai/vibecoder/chats/${id}`);
      return response?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([VIBECODER_CHATS_QUERY]);
      },
    }
  );
}

export function useVibecoderChat() {
  const { instance } = useContext(DexkitApiProvider);
  const subscriptionQuery = useSubscription();

  return useMutation(
    async ({
      prompt,
      chatId,
      chatName,
      appConfig,
      siteId,
      model,
    }: {
      prompt: string;
      chatId?: number;
      chatName?: string;
      appConfig: AppConfig;
      siteId: number;
      model: AI_MODEL;
    }) => {
      const response = await instance?.post('/ai/vibecoder/chat', {
        prompt,
        chatId,
        chatName,
        appConfig,
        siteId,
        model,
      });

      if (!response) {
        throw new Error('No response received from server');
      }

      if (!response.data) {
        console.error('Vibecoder chat response error:', response);
        throw new Error('No response data received from server');
      }

      if (!response.data.message) {
        console.error('Invalid vibecoder response structure:', response.data);
        throw new Error('Invalid response structure: missing message field');
      }

      return response.data as VibecoderChatResponse;
    },
    {
      onSuccess: async () => {
        await subscriptionQuery.refetch();
      },
    }
  );
}

export function useVibecoderChatHistory(chatId: number | null) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery<{ chatHistory: any[] }>(
    ['VIBECODER_CHAT_HISTORY', chatId],
    async () => {
      if (!chatId) {
        return { chatHistory: [] };
      }
      try {
        const response = await instance?.get(`/ai/vibecoder/chats/${chatId}/history`);
        return response?.data || { chatHistory: [] };
      } catch (error) {
        return { chatHistory: [] };
      }
    },
    {
      enabled: !!chatId,
      retry: false,
    }
  );
}


