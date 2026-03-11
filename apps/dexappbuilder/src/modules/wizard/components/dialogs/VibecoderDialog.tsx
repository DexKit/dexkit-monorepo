import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import MarkdownRenderer from '@dexkit/ui/components/MarkdownRenderer';
import { aiModelsItems } from '@dexkit/ui/constants/ai';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { AI_MODEL, AI_MODEL_TYPE } from '@dexkit/ui/types/ai';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
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
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import PreviewPage from '../PreviewPage';
import { useCreateAppFromVibecoder } from './useCreateAppFromVibecoder';
import {
  useCreateVibecoderChat,
  useDeleteVibecoderChat,
  useUpdateVibecoderChat,
  useVibecoderChat,
  useVibecoderChatHistory,
  useVibecoderChats
} from './useVibecoderChat';
import {
  useVibecoderCredits,
} from './useVibecoderCredits';
import {
  formatCost
} from './vibecoder-credits';
import {
  AppType,
  detectAppCreationRequest,
  extractAppConfigChanges,
} from './vibecoder-utils';
import VibecoderAppCreationForm, { AppCreationData } from './VibecoderAppCreationForm';
import VibecoderTemplateSelector from './VibecoderTemplateSelector';
import VibecoderVariantSelector from './VibecoderVariantSelector';

interface Props {
  dialogProps: DialogProps;
  pageKey?: string;
  onSave?: (sections: AppPageSection[]) => void;
  onSaveConfig?: (config: Partial<AppConfig>) => void;
  appConfig?: AppConfig;
  site?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  changes?: Partial<AppConfig>;
  suggestions?: string[];
  requiresConfirmation?: boolean;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(!isMobile);

  const {
    credits,
    freePromptsRemaining,
    getEstimatedCost,
    hasEnoughCredits: checkEnoughCredits,
    isLoading: creditsLoading,
    refetch: refetchCredits,
  } = useVibecoderCredits();

  const chatMutation = useVibecoderChat();
  const chatsQuery = useVibecoderChats();
  const createChatMutation = useCreateVibecoderChat();
  const updateChatMutation = useUpdateVibecoderChat();
  const deleteChatMutation = useDeleteVibecoderChat();

  const availableModels = useMemo(() => {
    return aiModelsItems.filter(
      (model) => model.type === AI_MODEL_TYPE.CODE || model.type === AI_MODEL_TYPE.TEXT
    );
  }, []);

  const getDefaultModel = () => {
    const codeModel = availableModels.find(m => m.type === AI_MODEL_TYPE.CODE);
    return codeModel ? codeModel.model : AI_MODEL.GPT_3_5_TURBO;
  };

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<AI_MODEL>(getDefaultModel());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Partial<AppConfig> | null>(null);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingChatName, setEditingChatName] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [pendingVariantSelection, setPendingVariantSelection] = useState<{
    sectionType: string;
    availableVariants: string[];
  } | null>(null);
  const [showAppCreationForm, setShowAppCreationForm] = useState(false);
  const [pendingAppCreation, setPendingAppCreation] = useState<{
    appType: AppType;
    prompt: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createAppMutation = useCreateAppFromVibecoder();

  const chatHistoryQuery = useVibecoderChatHistory(selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const estimatedCost = useMemo(() => {
    return getEstimatedCost(selectedModel);
  }, [selectedModel, getEstimatedCost]);

  const hasEnoughCredits = useMemo(() => {
    if (freePromptsRemaining > 0) {
      return true;
    }
    return checkEnoughCredits(estimatedCost);
  }, [freePromptsRemaining, estimatedCost, checkEnoughCredits]);

  const isInitialLoadRef = useRef(true);
  const lastSelectedChatIdRef = useRef<number | null>(null);
  const hasNewMessagesRef = useRef(false);

  useEffect(() => {
    if (selectedChatId !== lastSelectedChatIdRef.current) {
      lastSelectedChatIdRef.current = selectedChatId;
      isInitialLoadRef.current = true;
      hasNewMessagesRef.current = false;
    }

    if (selectedChatId && chatHistoryQuery.data && isInitialLoadRef.current && !hasNewMessagesRef.current) {
      const historyMessages: ChatMessage[] = [];
      const chatHistory = chatHistoryQuery.data.chatHistory as any[];

      chatHistory.forEach((msg: any, index: number) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          historyMessages.push({
            id: `msg-${selectedChatId}-${index}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(),
            ...(msg.role === 'assistant' ? {
              changes: extractAppConfigChanges(msg.content),
              suggestions: [],
            } : {}),
          });
        }
      });

      if (historyMessages.length > 0 || messages.length === 0) {
        setMessages(historyMessages);
        isInitialLoadRef.current = false;
      }
    } else if (!selectedChatId) {
      setMessages([]);
      isInitialLoadRef.current = true;
      hasNewMessagesRef.current = false;
    }
  }, [selectedChatId, chatHistoryQuery.data]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleCreateChat = async () => {
    try {
      const newChat = await createChatMutation.mutateAsync(undefined);
      if (newChat) {
        setSelectedChatId(newChat.id);
        setMessages([]);
      }
    } catch (error) {
      setError('Failed to create chat');
    }
  };

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    setPendingChanges(null);
  };

  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChatMutation.mutateAsync(chatId);
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }
    } catch (error) {
      setError('Failed to delete chat');
    }
  };

  const handleStartEditChat = (chatId: number, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingChatName(currentName);
  };

  const handleSaveEditChat = async () => {
    if (editingChatId && editingChatName.trim()) {
      try {
        await updateChatMutation.mutateAsync({
          id: editingChatId,
          name: editingChatName.trim(),
        });
        setEditingChatId(null);
        setEditingChatName('');
      } catch (error) {
        setError('Failed to update chat name');
      }
    }
  };

  const handleCancelEditChat = () => {
    setEditingChatId(null);
    setEditingChatName('');
  };

  const handleSendMessage = async () => {
    if (!currentPrompt.trim()) {
      return;
    }

    const detectedAppType = detectAppCreationRequest(currentPrompt);

    if (!appConfig && detectedAppType) {
      setPendingAppCreation({
        appType: detectedAppType,
        prompt: currentPrompt,
      });
      setShowAppCreationForm(true);
      setCurrentPrompt('');
      return;
    }

    if (!appConfig) {
      setError(formatMessage({
        id: 'vibecoder.no.app.config',
        defaultMessage: 'Please create an app first or select a template.',
      }));
      return;
    }

    if (!hasEnoughCredits) {
      setError(formatMessage({
        id: 'vibecoder.insufficient.credits',
        defaultMessage: 'Insufficient credits. Please add credits to continue.',
      }));
      return;
    }

    setError(null);
    setIsGenerating(true);

    const promptToSend = currentPrompt;
    setCurrentPrompt('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    hasNewMessagesRef.current = true;

    try {
      const response = await chatMutation.mutateAsync({
        prompt: promptToSend,
        chatId: selectedChatId || undefined,
        appConfig: appConfig,
        siteId: site ? parseInt(site) : 0,
        model: selectedModel,
      });

      if (!response || !response.message) {
        throw new Error(formatMessage({
          id: 'vibecoder.invalid.response',
          defaultMessage: 'Invalid response from server. Please try again.',
        }));
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message || formatMessage({
          id: 'vibecoder.no.message',
          defaultMessage: 'No response message received.',
        }),
        timestamp: new Date(),
        changes: response.changes,
        suggestions: response.suggestions,
        requiresConfirmation: response.requiresConfirmation,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.changes) {
        setPendingChanges(response.changes);
      }

      if (response.requiresVariantSelection) {
        setPendingVariantSelection(response.requiresVariantSelection);
        setShowVariantSelector(true);
      }

      if (response.chatId && !selectedChatId) {
        lastSelectedChatIdRef.current = response.chatId;
        setSelectedChatId(response.chatId);
        isInitialLoadRef.current = false;
      }

      await refetchCredits();
    } catch (err: any) {
      setError(err.message || formatMessage({
        id: 'vibecoder.generation.error',
        defaultMessage: 'Error generating response. Please try again.',
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyChanges = () => {
    if (pendingChanges && onSaveConfig) {
      onSaveConfig(pendingChanges);
      setPendingChanges(null);
      setError(null);
    }
  };

  const handleRejectChanges = () => {
    setPendingChanges(null);
  };

  const previewAppConfig = useMemo(() => {
    if (!appConfig) return undefined;
    if (!pendingChanges) return appConfig;

    return {
      ...appConfig,
      ...pendingChanges,
      pages: pendingChanges.pages ? {
        ...appConfig.pages,
        ...pendingChanges.pages,
      } : appConfig.pages,
    };
  }, [appConfig, pendingChanges]);

  const handleSelectTemplate = (templateAppConfig: AppConfig) => {
    if (onSaveConfig) {
      onSaveConfig(templateAppConfig);
    }
    setShowTemplateSelector(false);
  };

  const handleSelectVariant = (variant: string) => {
    if (pendingVariantSelection) {
      const promptWithVariant = `${currentPrompt} - Use variant: ${variant}`;
      setCurrentPrompt(promptWithVariant);
      setShowVariantSelector(false);
      setPendingVariantSelection(null);
      setTimeout(() => {
        handleSendMessage();
      }, 100);
    }
  };

  const handleCreateApp = async (data: AppCreationData) => {
    try {
      setError(null);
      const result = await createAppMutation.mutateAsync(data);

      enqueueSnackbar(
        formatMessage({
          id: 'vibecoder.app.created',
          defaultMessage: 'App created successfully! Redirecting...',
        }),
        { variant: 'success' }
      );

      setShowAppCreationForm(false);
      setPendingAppCreation(null);

      setTimeout(() => {
        router.push(`/admin/edit/${result.slug}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || formatMessage({
        id: 'vibecoder.app.creation.error',
        defaultMessage: 'Failed to create app. Please try again.',
      }));
    }
  };

  const handleCancelAppCreation = () => {
    setShowAppCreationForm(false);
    setPendingAppCreation(null);
  };

  useEffect(() => {
    if (dialogProps.open && !appConfig && !showAppCreationForm) {
    }
  }, [dialogProps.open, appConfig, showAppCreationForm]);

  return (
    <>
      <VibecoderTemplateSelector
        dialogProps={{
          open: showTemplateSelector,
          onClose: () => setShowTemplateSelector(false),
        }}
        onSelectTemplate={handleSelectTemplate}
      />

      {pendingVariantSelection && (
        <VibecoderVariantSelector
          dialogProps={{
            open: showVariantSelector,
            onClose: () => {
              setShowVariantSelector(false);
              setPendingVariantSelection(null);
            },
          }}
          sectionType={pendingVariantSelection.sectionType}
          availableVariants={pendingVariantSelection.availableVariants}
          onSelect={handleSelectVariant}
        />
      )}

      {pendingAppCreation && (
        <Dialog
          open={showAppCreationForm}
          onClose={handleCancelAppCreation}
          maxWidth="sm"
          fullWidth
        >
          <VibecoderAppCreationForm
            appType={pendingAppCreation.appType}
            onSubmit={handleCreateApp}
            onCancel={handleCancelAppCreation}
          />
        </Dialog>
      )}

      <Dialog
        {...dialogProps}
        maxWidth={false}
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? '100vw' : '95vw',
            height: isMobile ? '100vh' : '95vh',
            maxWidth: 'none',
            maxHeight: 'none',
            m: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => setShowSidebar(true)}
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                  >
                    <AddIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontSize: '1rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <FormattedMessage id="vibecoder.title" defaultMessage="VibeCoder" />
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Chip
                    label={
                      freePromptsRemaining > 0
                        ? `${freePromptsRemaining} free`
                        : `${credits.toFixed(2)}`
                    }
                    size="small"
                    color={freePromptsRemaining > 0 ? 'success' : 'default'}
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setShowPreview(!showPreview)}
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                  >
                    <AutoAwesomeIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Box>

              <Drawer
                anchor="left"
                open={showSidebar}
                onClose={() => setShowSidebar(false)}
                PaperProps={{
                  sx: { width: '80vw', maxWidth: 300 }
                }}
              >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                      <FormattedMessage id="vibecoder.chats" defaultMessage="Chats" />
                    </Typography>
                    <IconButton size="small" onClick={() => setShowSidebar(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        handleCreateChat();
                        setShowSidebar(false);
                      }}
                    >
                      <FormattedMessage id="vibecoder.new.chat" defaultMessage="New Chat" />
                    </Button>
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <List sx={{ p: 0 }}>
                      {chatsQuery.data?.map((chat) => (
                        <ListItem
                          key={chat.id}
                          disablePadding
                          sx={{
                            bgcolor: selectedChatId === chat.id ? 'action.selected' : 'transparent',
                          }}
                        >
                          <ListItemButton
                            onClick={() => {
                              handleSelectChat(chat.id);
                              setShowSidebar(false);
                            }}
                            sx={{ py: 1, px: 1.5 }}
                          >
                            {editingChatId === chat.id ? (
                              <TextField
                                value={editingChatName}
                                onChange={(e) => setEditingChatName(e.target.value)}
                                onBlur={handleSaveEditChat}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEditChat();
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditChat();
                                  }
                                }}
                                autoFocus
                                size="small"
                                sx={{ flex: 1 }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <>
                                <ListItemText
                                  primary={chat.name}
                                  secondary={new Date(chat.updatedAt).toLocaleDateString()}
                                  primaryTypographyProps={{
                                    noWrap: true,
                                    sx: { fontSize: '0.8rem' },
                                  }}
                                  secondaryTypographyProps={{
                                    sx: { fontSize: '0.7rem' },
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleStartEditChat(chat.id, chat.name, e)}
                                  sx={{ ml: 0.5 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  sx={{ ml: 0.5 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Drawer>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 1.5,
                  }}
                >
                  {messages.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        flexDirection: 'column',
                        gap: 1.5,
                        px: 2,
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 36, color: 'text.secondary' }} />
                      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ fontSize: '0.9rem' }}>
                        <FormattedMessage
                          id="vibecoder.welcome"
                          defaultMessage="Start a conversation with VibeCoder"
                        />
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: '0.75rem' }}>
                        <FormattedMessage
                          id="vibecoder.welcome.description"
                          defaultMessage="Ask me to create or edit pages, sections, SEO, themes, or generate logos for your app."
                        />
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {messages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <Paper
                            elevation={1}
                            sx={{
                              p: 1.5,
                              maxWidth: '85%',
                              bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                              color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                            }}
                          >
                            <MarkdownRenderer content={message.content} />
                            {message.suggestions && message.suggestions.length > 0 && (
                              <Box sx={{ mt: 1.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                                  <FormattedMessage
                                    id="vibecoder.suggestions"
                                    defaultMessage="Next steps:"
                                  />
                                </Typography>
                                <Stack spacing={0.25}>
                                  {message.suggestions.map((suggestion, index) => (
                                    <Typography key={index} variant="caption" component="div" sx={{ fontSize: '0.7rem' }}>
                                      • {suggestion}
                                    </Typography>
                                  ))}
                                </Stack>
                              </Box>
                            )}
                          </Paper>
                        </Box>
                      ))}
                      {isGenerating && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <Paper elevation={1} sx={{ p: 1.5 }}>
                            <CircularProgress size={14} />
                          </Paper>
                        </Box>
                      )}
                      <div ref={messagesEndRef} />
                    </Stack>
                  )}
                </Box>

                {pendingChanges && (
                  <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Alert severity="info" sx={{ mb: 1.5, py: 0.5 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        <FormattedMessage
                          id="vibecoder.pending.changes"
                          defaultMessage="The bot has proposed changes to your app configuration. Review and apply them below."
                        />
                      </Typography>
                    </Alert>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleApplyChanges}
                        sx={{ flex: 1, fontSize: '0.75rem', py: 0.75 }}
                      >
                        <FormattedMessage id="vibecoder.apply.changes" defaultMessage="Apply Changes" />
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRejectChanges}
                        sx={{ flex: 1, fontSize: '0.75rem', py: 0.75 }}
                      >
                        <FormattedMessage id="vibecoder.reject.changes" defaultMessage="Reject" />
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Box
                  sx={{
                    p: 1.5,
                    borderTop: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  {error && (
                    <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }} onClose={() => setError(null)}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>{error}</Typography>
                    </Alert>
                  )}

                  <Stack spacing={1}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.8rem' }}>
                        <FormattedMessage id="vibecoder.model.label" defaultMessage="AI Model" />
                      </InputLabel>
                      <Select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value as AI_MODEL)}
                        label={formatMessage({ id: 'vibecoder.model.label', defaultMessage: 'AI Model' })}
                        disabled={isGenerating}
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {availableModels.map((modelItem) => (
                          <MenuItem key={modelItem.model} value={modelItem.model} sx={{ fontSize: '0.8rem' }}>
                            {modelItem.model}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={3}
                        size="small"
                        value={currentPrompt}
                        onChange={(e) => setCurrentPrompt(e.target.value)}
                        placeholder={formatMessage({
                          id: 'vibecoder.prompt.placeholder',
                          defaultMessage: 'Type your message...',
                        })}
                        disabled={isGenerating || !hasEnoughCredits}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: '0.85rem',
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSendMessage}
                        disabled={isGenerating || !hasEnoughCredits || !currentPrompt.trim()}
                        sx={{ minWidth: 'auto', px: 1.5 }}
                      >
                        {isGenerating ? <CircularProgress size={14} /> : <SendIcon fontSize="small" />}
                      </Button>
                    </Stack>

                    {freePromptsRemaining === 0 && !hasEnoughCredits && (
                      <Alert severity="warning" sx={{ py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                          <FormattedMessage
                            id="vibecoder.insufficient.credits.detail"
                            defaultMessage="You need at least {cost} USD in credits. Please add credits to continue."
                            values={{ cost: formatCost(estimatedCost) }}
                          />
                        </Typography>
                      </Alert>
                    )}
                  </Stack>
                </Box>
              </Box>

              {showPreview && (
                <Drawer
                  anchor="bottom"
                  open={showPreview}
                  onClose={() => setShowPreview(false)}
                  PaperProps={{
                    sx: { height: '70vh', maxHeight: '70vh' }
                  }}
                >
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">
                        <FormattedMessage id="vibecoder.preview" defaultMessage="Preview" />
                      </Typography>
                      <IconButton size="small" onClick={() => setShowPreview(false)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
                      {previewAppConfig ? (
                        <PreviewPage
                          sections={previewAppConfig.pages?.[pageKey || 'home']?.sections || []}
                          disabled={false}
                          previewPlatform="mobile"
                          withLayout={true}
                          appConfig={previewAppConfig}
                          layout={undefined}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: '0.75rem' }}>
                            <FormattedMessage
                              id="vibecoder.preview.empty"
                              defaultMessage="Preview will appear here when changes are proposed."
                            />
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Drawer>
              )}
            </Box>
          ) : (
            <PanelGroup direction={isTablet ? "vertical" : "horizontal"} style={{ height: '100%' }}>
              <Panel defaultSize={isTablet ? 25 : 20} minSize={isTablet ? 20 : 15} maxSize={isTablet ? 35 : 30}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateChat}
                    >
                      <FormattedMessage id="vibecoder.new.chat" defaultMessage="New Chat" />
                    </Button>
                  </Box>

                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <List sx={{ p: 0 }}>
                      {chatsQuery.data?.map((chat) => (
                        <ListItem
                          key={chat.id}
                          disablePadding
                          sx={{
                            bgcolor: selectedChatId === chat.id ? 'action.selected' : 'transparent',
                          }}
                        >
                          <ListItemButton
                            onClick={() => handleSelectChat(chat.id)}
                            sx={{ py: 1 }}
                          >
                            {editingChatId === chat.id ? (
                              <TextField
                                value={editingChatName}
                                onChange={(e) => setEditingChatName(e.target.value)}
                                onBlur={handleSaveEditChat}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEditChat();
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditChat();
                                  }
                                }}
                                autoFocus
                                size="small"
                                sx={{ flex: 1 }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <>
                                <ListItemText
                                  primary={chat.name}
                                  secondary={new Date(chat.updatedAt).toLocaleDateString()}
                                  primaryTypographyProps={{
                                    noWrap: true,
                                    sx: { fontSize: '0.875rem' },
                                  }}
                                  secondaryTypographyProps={{
                                    sx: { fontSize: '0.75rem' },
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleStartEditChat(chat.id, chat.name, e)}
                                  sx={{ ml: 1 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  sx={{ ml: 0.5 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Panel>

              <PanelResizeHandle
                style={{
                  width: isTablet ? '4px' : '4px',
                  height: isTablet ? '4px' : 'auto',
                  backgroundColor: 'divider',
                  cursor: isTablet ? 'row-resize' : 'col-resize'
                }}
              />

              <Panel defaultSize={isTablet ? 50 : 50} minSize={isTablet ? 40 : 40}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      borderBottom: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      <FormattedMessage id="vibecoder.title" defaultMessage="VibeCoder" />
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={
                          freePromptsRemaining > 0
                            ? formatMessage(
                              { id: 'vibecoder.free.prompts', defaultMessage: '{count} free prompts' },
                              { count: freePromptsRemaining }
                            )
                            : formatMessage(
                              { id: 'vibecoder.credits', defaultMessage: '{credits} credits' },
                              { credits: credits.toFixed(2) }
                            )
                        }
                        size="small"
                        color={freePromptsRemaining > 0 ? 'success' : 'default'}
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' }, height: { xs: 24, md: 28 } }}
                      />
                      <AddCreditsButton />
                      <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      overflow: 'auto',
                      p: { xs: 1.5, md: 2 },
                    }}
                  >
                    {messages.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                          <FormattedMessage
                            id="vibecoder.welcome"
                            defaultMessage="Start a conversation with VibeCoder"
                          />
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, px: { xs: 2, md: 0 } }}>
                          <FormattedMessage
                            id="vibecoder.welcome.description"
                            defaultMessage="Ask me to create or edit pages, sections, SEO, themes, or generate logos for your app."
                          />
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {messages.map((message) => (
                          <Box
                            key={message.id}
                            sx={{
                              display: 'flex',
                              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                            }}
                          >
                            <Paper
                              elevation={1}
                              sx={{
                                p: { xs: 1.5, md: 2 },
                                maxWidth: { xs: '85%', md: '80%' },
                                bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                                color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                              }}
                            >
                              <MarkdownRenderer content={message.content} />
                              {message.suggestions && message.suggestions.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                                    <FormattedMessage
                                      id="vibecoder.suggestions"
                                      defaultMessage="Next steps:"
                                    />
                                  </Typography>
                                  <Stack spacing={0.5}>
                                    {message.suggestions.map((suggestion, index) => (
                                      <Typography key={index} variant="caption" component="div">
                                        • {suggestion}
                                      </Typography>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </Paper>
                          </Box>
                        ))}
                        {isGenerating && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <CircularProgress size={16} />
                            </Paper>
                          </Box>
                        )}
                        <div ref={messagesEndRef} />
                      </Stack>
                    )}
                  </Box>

                  {pendingChanges && (
                    <Box sx={{ p: { xs: 1.5, md: 2 }, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                      <Alert severity="info" sx={{ mb: { xs: 1.5, md: 2 }, py: { xs: 0.5, md: 1 } }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          <FormattedMessage
                            id="vibecoder.pending.changes"
                            defaultMessage="The bot has proposed changes to your app configuration. Review and apply them below."
                          />
                        </Typography>
                      </Alert>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          size={isMobile ? 'small' : 'medium'}
                          onClick={handleApplyChanges}
                          sx={{ flex: 1, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                        >
                          <FormattedMessage id="vibecoder.apply.changes" defaultMessage="Apply Changes" />
                        </Button>
                        <Button
                          variant="outlined"
                          size={isMobile ? 'small' : 'medium'}
                          onClick={handleRejectChanges}
                          sx={{ flex: 1, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                        >
                          <FormattedMessage id="vibecoder.reject.changes" defaultMessage="Reject" />
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      borderTop: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    }}
                  >
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}

                    <Stack spacing={1}>
                      <FormControl fullWidth size="small">
                        <InputLabel>
                          <FormattedMessage id="vibecoder.model.label" defaultMessage="AI Model" />
                        </InputLabel>
                        <Select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value as AI_MODEL)}
                          label={formatMessage({ id: 'vibecoder.model.label', defaultMessage: 'AI Model' })}
                          disabled={isGenerating}
                        >
                          {availableModels.map((modelItem) => (
                            <MenuItem key={modelItem.model} value={modelItem.model}>
                              {modelItem.model}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          multiline
                          maxRows={isMobile ? 3 : 4}
                          size={isMobile ? 'small' : 'medium'}
                          value={currentPrompt}
                          onChange={(e) => setCurrentPrompt(e.target.value)}
                          placeholder={formatMessage({
                            id: 'vibecoder.prompt.placeholder',
                            defaultMessage: 'Type your message...',
                          })}
                          disabled={isGenerating || !hasEnoughCredits}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          sx={{
                            '& .MuiInputBase-input': {
                              fontSize: { xs: '0.85rem', md: '0.875rem' },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          size={isMobile ? 'small' : 'medium'}
                          onClick={handleSendMessage}
                          disabled={isGenerating || !hasEnoughCredits || !currentPrompt.trim()}
                          startIcon={isGenerating ? <CircularProgress size={isMobile ? 14 : 16} /> : <SendIcon />}
                          sx={{
                            minWidth: { xs: 'auto', md: '64px' },
                            px: { xs: 1.5, md: 2 },
                            fontSize: { xs: '0.75rem', md: '0.875rem' }
                          }}
                        >
                          {!isMobile && <FormattedMessage id="send" defaultMessage="Send" />}
                        </Button>
                      </Stack>

                      {freePromptsRemaining === 0 && !hasEnoughCredits && (
                        <Alert severity="warning">
                          <Typography variant="caption">
                            <FormattedMessage
                              id="vibecoder.insufficient.credits.detail"
                              defaultMessage="You need at least {cost} USD in credits. Please add credits to continue."
                              values={{ cost: formatCost(estimatedCost) }}
                            />
                          </Typography>
                        </Alert>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Panel>

              <PanelResizeHandle
                style={{
                  width: isTablet ? '4px' : '4px',
                  height: isTablet ? '4px' : 'auto',
                  backgroundColor: 'divider',
                  cursor: isTablet ? 'row-resize' : 'col-resize'
                }}
              />

              <Panel defaultSize={isTablet ? 25 : 30} minSize={isTablet ? 20 : 20}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                    p: { xs: 1.5, md: 2 },
                    overflow: 'auto',
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    <FormattedMessage id="vibecoder.preview" defaultMessage="Preview" />
                  </Typography>
                  <Divider sx={{ mb: { xs: 1.5, md: 2 } }} />

                  {previewAppConfig ? (
                    <PreviewPage
                      sections={previewAppConfig.pages?.[pageKey || 'home']?.sections || []}
                      disabled={false}
                      previewPlatform="desktop"
                      withLayout={true}
                      appConfig={previewAppConfig}
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
                          defaultMessage="Preview will appear here when changes are proposed."
                        />
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Panel>
            </PanelGroup>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

