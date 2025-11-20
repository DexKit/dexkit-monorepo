import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import { aiModelsItems } from '@dexkit/ui/constants/ai';
import { useSubscription } from '@dexkit/ui/hooks/payments';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { AI_MODEL, AI_MODEL_TYPE } from '@dexkit/ui/types/ai';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import PreviewPage from '../PreviewPage';
import {
  useGenerateVibecoderSections,
  useVibecoderCredits,
} from './useVibecoderCredits';
import {
  formatCost
} from './vibecoder-credits';
import {
  APP_TYPE_REQUIREMENTS,
  AppType,
  buildEnhancedPrompt,
  detectAppType,
  detectVibecoderIntent,
  extractColorsFromPrompt,
  extractNetworkFromPrompt,
  extractTokensFromPrompt,
  getThemeInfo,
  validateGeneratedSections,
  VibecoderIntent,
} from './vibecoder-utils';

interface Props {
  dialogProps: DialogProps;
  pageKey?: string;
  onSave?: (sections: AppPageSection[]) => void;
  onSaveConfig?: (config: Partial<AppConfig>) => void;
  appConfig?: AppConfig;
  site?: string;
}

interface HistoryEntry {
  id: string;
  sections: AppPageSection[];
  prompt: string;
  timestamp: Date;
  appType: AppType;
}

const MAX_HISTORY_SIZE = 50;

export default function VibecoderDialog({
  dialogProps,
  pageKey,
  onSave,
  onSaveConfig,
  appConfig,
  site,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();
  const subscriptionQuery = useSubscription();
  const {
    credits,
    freePromptsRemaining,
    freePromptsUsedToday,
    getEstimatedCost,
    calculateRealCost,
    hasEnoughCredits: checkEnoughCredits,
    isLoading: creditsLoading,
    refetch: refetchCredits,
  } = useVibecoderCredits();

  const generateSectionsMutation = useGenerateVibecoderSections();

  const availableModels = useMemo(() => {
    return aiModelsItems.filter(
      (model) => model.type === AI_MODEL_TYPE.CODE || model.type === AI_MODEL_TYPE.TEXT
    );
  }, []);

  const getDefaultModel = () => {
    const codeModel = availableModels.find(m => m.type === AI_MODEL_TYPE.CODE);
    return codeModel ? codeModel.model : AI_MODEL.GPT_3_5_TURBO;
  };

  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<AI_MODEL>(getDefaultModel());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<AppPageSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detectedAppType, setDetectedAppType] = useState<AppType | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [generatedSeo, setGeneratedSeo] = useState<{
    title: string;
    description: string;
    keywords?: string[];
    pageKey?: string;
  } | null>(null);

  // Calcular costo estimado para el modelo seleccionado
  const estimatedCost = useMemo(() => {
    return getEstimatedCost(selectedModel);
  }, [selectedModel, getEstimatedCost]);

  // Verificar si tiene suficientes créditos para el costo estimado
  const hasEnoughCredits = useMemo(() => {
    // Si tiene prompts gratis disponibles, no necesita créditos
    if (freePromptsRemaining > 0) {
      return true;
    }
    // Si no tiene prompts gratis, verificar créditos
    return checkEnoughCredits(estimatedCost);
  }, [freePromptsRemaining, estimatedCost, checkEnoughCredits]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const saveToHistory = (sections: AppPageSection[], prompt: string, appType: AppType) => {
    const newEntry: HistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sections: structuredClone(sections),
      prompt,
      timestamp: new Date(),
      appType,
    };

    setHistory((prevHistory) => {
      const newHistory = currentHistoryIndex >= 0 && currentHistoryIndex < prevHistory.length - 1
        ? prevHistory.slice(0, currentHistoryIndex + 1)
        : prevHistory;

      const updatedHistory = [...newHistory, newEntry];

      const finalHistory = updatedHistory.length > MAX_HISTORY_SIZE
        ? updatedHistory.slice(-MAX_HISTORY_SIZE)
        : updatedHistory;

      setCurrentHistoryIndex(finalHistory.length - 1);

      return finalHistory;
    });
  };

  const handleRollback = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const entry = history[newIndex];

      if (entry) {
        setCurrentHistoryIndex(newIndex);
        setGeneratedSections(structuredClone(entry.sections));
        setPrompt(entry.prompt);
        setDetectedAppType(entry.appType);
      }
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const entry = history[newIndex];

      if (entry) {
        setCurrentHistoryIndex(newIndex);
        setGeneratedSections(structuredClone(entry.sections));
        setPrompt(entry.prompt);
        setDetectedAppType(entry.appType);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentHistoryIndex(-1);
  };

  const canRollback = useMemo(() => {
    return currentHistoryIndex > 0 && history.length > 0;
  }, [currentHistoryIndex, history.length]);

  const canRedo = useMemo(() => {
    return currentHistoryIndex >= 0 && currentHistoryIndex < history.length - 1;
  }, [currentHistoryIndex, history.length]);

  const detectedTokens = useMemo(() => {
    if (!prompt.trim()) return [];
    return extractTokensFromPrompt(prompt);
  }, [prompt]);

  const detectedNetwork = useMemo(() => {
    if (!prompt.trim()) return null;
    return extractNetworkFromPrompt(prompt);
  }, [prompt]);

  const detectedColors = useMemo(() => {
    if (!prompt.trim()) return [];
    return extractColorsFromPrompt(prompt);
  }, [prompt]);

  const networkNames: Record<number, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    56: 'Binance Smart Chain',
    43114: 'Avalanche',
    10: 'Optimism',
    8453: 'Base',
    42161: 'Arbitrum',
    42220: 'Celo',
    25: 'Cronos',
    81457: 'Blast',
    59144: 'Linea',
    534352: 'Scroll',
    5000: 'Mantle',
    34443: 'Mode',
    369: 'Pulse',
  };

  useEffect(() => {
    if (!prompt.trim()) {
      setDetectedAppType(null);
      return;
    }
    const detected = detectAppType(prompt);
    setDetectedAppType(detected);
  }, [prompt]);

  useEffect(() => {
    if (!dialogProps.open) {
      clearHistory();
      setGeneratedSections([]);
      setPrompt('');
      setError(null);
      setDetectedAppType(null);
      setGeneratedLogos([]);
      setGeneratedSeo(null);
    }
  }, [dialogProps.open]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(formatMessage({
        id: 'vibecoder.prompt.required',
        defaultMessage: 'Please enter a prompt to generate sections',
      }));
      return;
    }

    if (!hasEnoughCredits) {
      setError(formatMessage({
        id: 'vibecoder.insufficient.credits',
        defaultMessage: freePromptsRemaining === 0
          ? 'Insufficient credits. Please add credits to continue.'
          : 'Insufficient credits for this model. Please add credits or use a cheaper model.',
      }));
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const intent = detectVibecoderIntent(prompt);

      if (intent === VibecoderIntent.GENERATE_SECTIONS) {
        const appType = detectAppType(prompt);
        setDetectedAppType(appType);
      } else {
        setDetectedAppType(null);
      }

      let result: {
        sections?: AppPageSection[];
        detectedColors?: string[];
        logoUrls?: string[];
        seo?: {
          title: string;
          description: string;
          keywords?: string[];
          pageKey?: string;
        };
        usage?: {
          input_tokens: number;
          output_tokens: number;
        };
        chatId?: number;
      } | null = null;

      try {
        let finalPrompt = prompt;
        if (intent === VibecoderIntent.GENERATE_SECTIONS) {
          const appType = detectAppType(prompt);
          finalPrompt = buildEnhancedPrompt(prompt, appType, appConfig);
        }

        result = await generateSectionsMutation.mutateAsync({
          prompt: finalPrompt,
          model: selectedModel,
          siteId: site ? parseInt(site) : undefined,
          intent: intent,
          pageKey: pageKey,
        });

        if (result?.usage) {
          const realCost = calculateRealCost(
            selectedModel,
            result.usage.input_tokens,
            result.usage.output_tokens,
          );
          await refetchCredits();
        }
      } catch (apiError: any) {
        if (intent !== VibecoderIntent.GENERATE_SECTIONS) {
          setError(
            formatMessage({
              id: 'vibecoder.api.error',
              defaultMessage: 'Error generating content. Please try again.',
            })
          );
          setIsGenerating(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const appType = detectAppType(prompt);
        const requirements = APP_TYPE_REQUIREMENTS[appType];
        const mockSections: AppPageSection[] = [];
        const tokens = extractTokensFromPrompt(prompt);
        const networkChainId = extractNetworkFromPrompt(prompt);
        const themeInfo = getThemeInfo(appConfig);
        const detectedColors = extractColorsFromPrompt(prompt);

        if (requirements.requiredSections.length > 0) {
          requirements.requiredSections.forEach((sectionType) => {
            if (sectionType === 'swap') {
              const swapConfig: any = {};

              if (networkChainId) {
                swapConfig.defaultChainId = networkChainId;
                swapConfig.defaultEditChainId = networkChainId;
              }

              if (tokens.length >= 2 && networkChainId) {
                swapConfig.configByChain = {
                  [networkChainId]: {
                    sellToken: {
                      symbol: tokens[0],
                      chainId: networkChainId,
                    },
                    buyToken: {
                      symbol: tokens[1],
                      chainId: networkChainId,
                    },
                  },
                };
              } else if (tokens.length === 1 && networkChainId) {
                swapConfig.configByChain = {
                  [networkChainId]: {
                    buyToken: {
                      symbol: tokens[0],
                      chainId: networkChainId,
                    },
                  },
                };
              }

              const backgroundColor = detectedColors.length > 0
                ? detectedColors[0]
                : themeInfo.backgroundColor || themeInfo.primaryColor;

              const textColor = themeInfo.textColor || (detectedColors.length > 0 ? '#FFFFFF' : undefined);

              if (backgroundColor) {
                swapConfig.glassSettings = {
                  backgroundColor: backgroundColor,
                  backgroundType: 'solid',
                  textColor: textColor,
                };
              }

              mockSections.push({
                type: 'swap',
                title: 'Swap',
                name: 'AI Generated Swap Section',
                config: swapConfig,
              } as AppPageSection);
            } else if (sectionType === 'exchange') {
              const exchangeSettings: any = {
                defaultNetwork: networkChainId || undefined,
              };

              if (tokens.length >= 2 && networkChainId) {
                exchangeSettings.defaultPairs = {
                  [networkChainId]: {
                    baseToken: {
                      symbol: tokens[0],
                      chainId: networkChainId,
                    },
                    quoteToken: {
                      symbol: tokens[1],
                      chainId: networkChainId,
                    },
                  },
                };
              }

              mockSections.push({
                type: 'exchange',
                title: 'Exchange',
                name: 'AI Generated Exchange Section',
                settings: exchangeSettings,
              } as AppPageSection);
            } else if (sectionType === 'wallet') {
              mockSections.push({
                type: 'wallet',
                title: 'Wallet',
                name: 'AI Generated Wallet Section',
              } as AppPageSection);
            } else if (sectionType === 'asset-store') {
              mockSections.push({
                type: 'asset-store',
                title: 'NFT Store',
                name: 'AI Generated NFT Store Section',
              } as AppPageSection);
            } else if (sectionType === 'collections' || sectionType === 'collection') {
              mockSections.push({
                type: sectionType as 'collections' | 'collection',
                title: 'Collection',
                name: 'AI Generated Collection Section',
              } as AppPageSection);
            } else if (sectionType === 'commerce') {
              mockSections.push({
                type: 'commerce',
                title: 'Commerce',
                name: 'AI Generated Commerce Section',
              } as AppPageSection);
            } else if (sectionType === 'referral') {
              mockSections.push({
                type: 'referral',
                title: 'Referral Program',
                name: 'AI Generated Referral Section',
              } as AppPageSection);
            } else if (sectionType === 'ranking') {
              mockSections.push({
                type: 'ranking',
                title: 'Leaderboard',
                name: 'AI Generated Leaderboard Section',
              } as AppPageSection);
            } else if (sectionType === 'token-trade') {
              mockSections.push({
                type: 'token-trade',
                title: 'Token Trade',
                name: 'AI Generated Token Trade Section',
              } as AppPageSection);
            } else {
              mockSections.push({
                type: 'markdown',
                title: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`,
                name: `AI Generated ${sectionType} Section`,
              } as AppPageSection);
            }
          });
        } else {
          mockSections.push({
            type: 'markdown',
            title: 'Generated Section',
            name: 'AI Generated Section',
          } as AppPageSection);
        }

        const validation = validateGeneratedSections(mockSections, appType);
        if (!validation.valid) {
          setError(
            formatMessage({
              id: 'vibecoder.validation.error',
              defaultMessage: 'Validation errors: {errors}',
            }, { errors: validation.errors.join(', ') })
          );
          setIsGenerating(false);
          return;
        }

        result = {
          sections: mockSections,
          detectedColors: detectedColors,
        };
      }

      if (intent === VibecoderIntent.GENERATE_SECTIONS && result.sections) {
        const appType = detectAppType(prompt);
        const validation = validateGeneratedSections(result.sections, appType);
        if (!validation.valid) {
          setError(
            formatMessage({
              id: 'vibecoder.validation.error',
              defaultMessage: 'Validation errors: {errors}',
            }, { errors: validation.errors.join(', ') })
          );
          return;
        }

        setGeneratedSections(result.sections);
        saveToHistory(result.sections, prompt, appType);
      } else if (intent === VibecoderIntent.GENERATE_LOGO && result.logoUrls) {
        setError(null);
        setGeneratedLogos(result.logoUrls);
        setGeneratedSections([]);
      } else if (intent === VibecoderIntent.GENERATE_SEO && result.seo) {
        setError(null);
        setGeneratedSeo(result.seo);
        setGeneratedSections([]);

        // Save SEO to appConfig
        if (onSaveConfig && result.seo) {
          const targetPageKey = result.seo.pageKey || pageKey || 'home';
          onSaveConfig({
            seo: {
              ...(appConfig?.seo || {}),
              [targetPageKey]: {
                title: result.seo.title,
                description: result.seo.description,
                images: appConfig?.seo?.[targetPageKey]?.images || [],
              },
            },
          });
        }
      }

      await refetchCredits();

    } catch (err) {
      setError(formatMessage({
        id: 'vibecoder.generation.error',
        defaultMessage: 'Error generating sections. Please try again.',
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (onSave && generatedSections.length > 0) {
      onSave(generatedSections);
      handleClose();
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedSections([]);
    setError(null);
    setDetectedAppType(null);
    setGeneratedLogos([]);
    setGeneratedSeo(null);
  };

  const handleSelectLogo = (logoUrl: string) => {
    if (onSaveConfig) {
      onSaveConfig({
        logo: {
          ...(appConfig?.logo || {}),
          url: logoUrl,
        },
      });
      setGeneratedLogos([]);
      setError(null);
    }
  };

  const handleSaveSeo = () => {
    if (onSaveConfig && generatedSeo) {
      const targetPageKey = generatedSeo.pageKey || pageKey || 'home';
      onSaveConfig({
        seo: {
          ...(appConfig?.seo || {}),
          [targetPageKey]: {
            title: generatedSeo.title,
            description: generatedSeo.description,
            images: appConfig?.seo?.[targetPageKey]?.images || [],
          },
        },
      });
      setGeneratedSeo(null);
      handleClose();
    }
  };

  return (
    <Dialog
      {...dialogProps}
      maxWidth="xl"
      fullWidth
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          height: '100vh',
          maxHeight: '100vh',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6">
            <FormattedMessage
              id="vibecoder.title"
              defaultMessage="VibeCoder - AI Section Generator"
            />
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          {history.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={handleRollback}
                disabled={!canRollback || isGenerating}
                size="small"
                title={formatMessage({
                  id: 'vibecoder.history.rollback',
                  defaultMessage: 'Go to previous version',
                })}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleRedo}
                disabled={!canRedo || isGenerating}
                size="small"
                title={formatMessage({
                  id: 'vibecoder.history.redo',
                  defaultMessage: 'Go to next version',
                })}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
              <Chip
                icon={<HistoryIcon />}
                label={`${currentHistoryIndex + 1}/${history.length}`}
                size="small"
                variant="outlined"
                sx={{ cursor: 'default' }}
              />
            </Stack>
          )}
          <Stack direction="row" alignItems="center" spacing={1}>
            {freePromptsRemaining > 0 && (
              <Chip
                label={`${freePromptsRemaining} free prompts left today`}
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="credits" defaultMessage="Credits" />
            </Typography>
            <Typography variant="body2">
              {subscriptionQuery.data ? (
                <FormattedNumber
                  style="currency"
                  currencyDisplay="narrowSymbol"
                  currency="USD"
                  value={credits}
                  minimumFractionDigits={2}
                />
              ) : (
                '...'
              )}
            </Typography>
          </Stack>
          <AddCreditsButton />
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>

      <DialogContent sx={{ p: 0, height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        <PanelGroup direction="horizontal" style={{ height: '100%' }}>
          <Panel
            defaultSize={50}
            minSize={30}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: 2,
                overflow: 'auto',
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage
                  id="vibecoder.prompt.label"
                  defaultMessage="Describe what you want to create"
                />
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                <FormattedMessage
                  id="vibecoder.prompt.hint"
                  defaultMessage="Use natural language to describe the sections you want to add to your page. The AI will generate sections using only DexAppBuilder components."
                />
              </Typography>

              <TextField
                multiline
                rows={8}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={formatMessage({
                  id: 'vibecoder.prompt.placeholder',
                  defaultMessage: 'Example: Create a swap app, Create an NFT store, Create a wallet app...',
                })}
                sx={{ mb: 2 }}
                disabled={isGenerating}
              />

              {detectedAppType && detectedAppType !== AppType.GENERAL && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" fontWeight="medium">
                      <FormattedMessage
                        id="vibecoder.detected.type"
                        defaultMessage="Detected App Type: {type}"
                        values={{ type: detectedAppType }}
                      />
                    </Typography>
                    <Typography variant="caption">
                      {APP_TYPE_REQUIREMENTS[detectedAppType].description}
                    </Typography>
                    {APP_TYPE_REQUIREMENTS[detectedAppType].requiredSections.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        <Typography variant="caption" fontWeight="medium">
                          Required:
                        </Typography>
                        {APP_TYPE_REQUIREMENTS[detectedAppType].requiredSections.map((section) => (
                          <Chip
                            key={section}
                            label={section}
                            size="small"
                            color="primary"
                            variant="filled"
                          />
                        ))}
                      </Stack>
                    )}
                    {detectedTokens.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        <Typography variant="caption" fontWeight="medium">
                          <FormattedMessage
                            id="vibecoder.detected.tokens"
                            defaultMessage="Detected Tokens:"
                          />
                        </Typography>
                        {detectedTokens.map((token) => (
                          <Chip
                            key={token}
                            label={token}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}
                    {detectedNetwork && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        <Typography variant="caption" fontWeight="medium">
                          <FormattedMessage
                            id="vibecoder.detected.network"
                            defaultMessage="Detected Network:"
                          />
                        </Typography>
                        <Chip
                          label={networkNames[detectedNetwork] || `ChainId: ${detectedNetwork}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Stack>
                    )}
                    {detectedColors.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        <Typography variant="caption" fontWeight="medium">
                          <FormattedMessage
                            id="vibecoder.detected.colors"
                            defaultMessage="Detected Colors:"
                          />
                        </Typography>
                        {detectedColors.map((color) => (
                          <Chip
                            key={color}
                            label={color}
                            size="small"
                            sx={{
                              backgroundColor: color,
                              color: '#FFFFFF',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              '& .MuiChip-label': {
                                fontWeight: 'bold',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Alert>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>
                  <FormattedMessage
                    id="vibecoder.model.label"
                    defaultMessage="AI Model"
                  />
                </InputLabel>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as AI_MODEL)}
                  label={formatMessage({
                    id: 'vibecoder.model.label',
                    defaultMessage: 'AI Model',
                  })}
                  disabled={isGenerating}
                >
                  {availableModels.map((modelItem) => (
                    <MenuItem key={modelItem.model} value={modelItem.model}>
                      {modelItem.model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Información sobre costo y prompts gratis */}
              <Alert
                severity={freePromptsRemaining > 0 ? 'info' : hasEnoughCredits ? 'info' : 'warning'}
                sx={{ mb: 2 }}
              >
                <Stack spacing={0.5}>
                  {freePromptsRemaining > 0 ? (
                    <Typography variant="body2">
                      <FormattedMessage
                        id="vibecoder.free.prompt.info"
                        defaultMessage="This generation will use 1 of your {remaining} free prompts today."
                        values={{ remaining: freePromptsRemaining }}
                      />
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      <FormattedMessage
                        id="vibecoder.cost.info"
                        defaultMessage="Estimated cost: {cost} USD (based on {model})"
                        values={{
                          cost: formatCost(estimatedCost),
                          model: selectedModel,
                        }}
                      />
                    </Typography>
                  )}
                  {freePromptsRemaining === 0 && !hasEnoughCredits && (
                    <Typography variant="caption" color="error">
                      <FormattedMessage
                        id="vibecoder.insufficient.credits.detail"
                        defaultMessage="You need at least {cost} USD in credits. Please add credits to continue."
                        values={{ cost: formatCost(estimatedCost) }}
                      />
                    </Typography>
                  )}
                </Stack>
              </Alert>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={isGenerating || !hasEnoughCredits || !prompt.trim()}
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={16} />
                    ) : (
                      <AutoAwesomeIcon />
                    )
                  }
                  sx={{ flex: 1 }}
                >
                  {isGenerating ? (
                    <FormattedMessage
                      id="vibecoder.generating"
                      defaultMessage="Generating..."
                    />
                  ) : (
                    <FormattedMessage
                      id="vibecoder.generate"
                      defaultMessage="Generate Sections"
                    />
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  disabled={isGenerating}
                >
                  <FormattedMessage id="clear" defaultMessage="Clear" />
                </Button>
              </Stack>

              {generatedSections.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    <FormattedMessage
                      id="vibecoder.generated.sections"
                      defaultMessage="Generated Sections ({count})"
                      values={{ count: generatedSections.length }}
                    />
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      maxHeight: 200,
                      overflow: 'auto',
                      bgcolor: 'background.default',
                    }}
                  >
                    <Stack spacing={1}>
                      {generatedSections.map((section, index) => (
                        <Box key={index}>
                          <Typography variant="body2" fontWeight="medium">
                            {section.name || section.title || `Section ${index + 1}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Type: {section.type}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </>
              )}

              {generatedLogos.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    <FormattedMessage
                      id="vibecoder.generated.logos"
                      defaultMessage="Generated Logos ({count})"
                      values={{ count: generatedLogos.length }}
                    />
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {generatedLogos.map((logoUrl, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            border: 2,
                            borderColor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <img
                            src={logoUrl}
                            alt={`Logo ${index + 1}`}
                            style={{
                              width: 150,
                              height: 150,
                              objectFit: 'contain',
                              display: 'block',
                            }}
                            onClick={() => handleSelectLogo(logoUrl)}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            fullWidth
                            onClick={() => handleSelectLogo(logoUrl)}
                            sx={{ mt: 1 }}
                          >
                            <FormattedMessage
                              id="vibecoder.select.logo"
                              defaultMessage="Select Logo"
                            />
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </>
              )}

              {generatedSeo && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    <FormattedMessage
                      id="vibecoder.generated.seo"
                      defaultMessage="Generated SEO for {page}"
                      values={{ page: generatedSeo.pageKey || pageKey || 'home' }}
                    />
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mt: 1,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          <FormattedMessage id="vibecoder.seo.title" defaultMessage="Title" />
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {generatedSeo.title}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          <FormattedMessage
                            id="vibecoder.seo.description"
                            defaultMessage="Description"
                          />
                        </Typography>
                        <Typography variant="body2">
                          {generatedSeo.description}
                        </Typography>
                      </Box>
                      {generatedSeo.keywords && generatedSeo.keywords.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            <FormattedMessage
                              id="vibecoder.seo.keywords"
                              defaultMessage="Keywords"
                            />
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                            {generatedSeo.keywords.map((keyword, index) => (
                              <Chip
                                key={index}
                                label={keyword}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </>
              )}

              <Box sx={{ flex: 1 }} />

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{ flex: 1 }}
                >
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                {generatedSections.length > 0 && (
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ flex: 1 }}
                  >
                    <FormattedMessage
                      id="vibecoder.save.sections"
                      defaultMessage="Save Sections"
                    />
                  </Button>
                )}
                {generatedSeo && onSaveConfig && (
                  <Button
                    variant="contained"
                    onClick={handleSaveSeo}
                    sx={{ flex: 1 }}
                  >
                    <FormattedMessage
                      id="vibecoder.save.seo"
                      defaultMessage="Save SEO"
                    />
                  </Button>
                )}
              </Stack>
            </Box>
          </Panel>

          <PanelResizeHandle
            style={{
              width: '4px',
              backgroundColor: 'divider',
              cursor: 'col-resize',
            }}
          />

          <Panel
            defaultSize={50}
            minSize={30}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: 2,
                bgcolor: 'background.default',
                overflow: 'auto',
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage
                  id="vibecoder.preview"
                  defaultMessage="Preview"
                />
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {generatedSections.length > 0 ? (
                <PreviewPage
                  sections={generatedSections}
                  disabled={false}
                  previewPlatform="desktop"
                  withLayout={true}
                  appConfig={appConfig}
                  layout={undefined}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: 400,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" align="center">
                    <FormattedMessage
                      id="vibecoder.preview.empty"
                      defaultMessage="Generated sections will appear here. Enter a prompt and click 'Generate Sections' to see the preview."
                    />
                  </Typography>
                </Box>
              )}
            </Box>
          </Panel>
        </PanelGroup>
      </DialogContent>
    </Dialog>
  );
}

