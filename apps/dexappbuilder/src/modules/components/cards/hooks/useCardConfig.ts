import { useState } from 'react';
import { CardProps } from '../types/card';

export function useCardConfig(initialConfig?: Partial<CardProps>) {
  const [config, setConfig] = useState<CardProps>({
    title: '',
    description: '',
    image: '',
    actions: [],
    sx: {},
    ...initialConfig,
  });

  return {
    config,
    setConfig,
  };
} 