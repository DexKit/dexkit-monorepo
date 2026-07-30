import { AI_MODEL } from '@dexkit/ui/types/ai';
import Decimal from 'decimal.js';

export const FREE_PROMPTS_PER_DAY = 10;

export const DEXKIT_PROFIT_MARGIN = 1.2;

export const MODEL_PRICING: Record<
  string,
  {
    inputPricePerMillion: number;
    outputPricePerMillion: number;
  }
> = {
  [AI_MODEL.GPT_3_5_TURBO]: {
    inputPricePerMillion: 0.5,
    outputPricePerMillion: 1.5,
  },
  [AI_MODEL.GPT_4_1]: {
    inputPricePerMillion: 10.0,
    outputPricePerMillion: 30.0,
  },
  [AI_MODEL.CLAUDE_4_SONNET]: {
    inputPricePerMillion: 3.0,
    outputPricePerMillion: 15.0,
  },
  [AI_MODEL.GEMINI_2_0_FLASH]: {
    inputPricePerMillion: 0.075,
    outputPricePerMillion: 0.3,
  },
};

export function calculateTokenCost(
  model: AI_MODEL,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = MODEL_PRICING[model];

  if (!pricing) {
    const defaultPricing = MODEL_PRICING[AI_MODEL.GPT_3_5_TURBO];
    const inputCost = new Decimal(inputTokens)
      .div(1_000_000)
      .mul(defaultPricing.inputPricePerMillion);
    const outputCost = new Decimal(outputTokens)
      .div(1_000_000)
      .mul(defaultPricing.outputPricePerMillion);
    const totalCost = inputCost.add(outputCost);
    return totalCost.mul(DEXKIT_PROFIT_MARGIN).toNumber();
  }

  const inputCost = new Decimal(inputTokens)
    .div(1_000_000)
    .mul(pricing.inputPricePerMillion);

  const outputCost = new Decimal(outputTokens)
    .div(1_000_000)
    .mul(pricing.outputPricePerMillion);

  const totalCost = inputCost.add(outputCost);

  const costWithMargin = totalCost.mul(DEXKIT_PROFIT_MARGIN);

  return costWithMargin.toNumber();
}

export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return '< $0.01';
  }
  return `$${cost.toFixed(4)}`;
}

export function getEstimatedCostPerPrompt(model: AI_MODEL): number {
  const estimatedInputTokens = 1000;
  const estimatedOutputTokens = 500;
  return calculateTokenCost(model, estimatedInputTokens, estimatedOutputTokens);
}

