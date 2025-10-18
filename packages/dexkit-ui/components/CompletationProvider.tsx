import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import React, { MouseEvent, useCallback, useRef, useState } from "react";
import CompletationContext from "../context/CompletationContext";

import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { useCompletation } from "../hooks/ai";
import { AI_MODEL, TextImproveAction } from "../types/ai";

const MediaDialog = dynamic(() => import("./mediaDialog"), {
  ssr: false,
});

const CompletationPopover = dynamic(() => import("./CompletationPopover"), {
  ssr: false,
});

export interface CompletationProviderProps {
  children: ({ }: {
    ref: any;
    inputAdornment: (position: "start" | "end") => React.ReactNode;
    open: () => void;
  }) => React.ReactNode;
  onCompletation: (output: string) => void;
  output?: string | null;
  initialPrompt?: string;
  multiline?: boolean;
  messages?: { role: string; content: string }[];
  filteredActions?: TextImproveAction[];
  selectedAction?: TextImproveAction;
  withContext?: boolean;
}

export default function CompletationProvider({
  children,
  onCompletation,
  output,
  initialPrompt,
  multiline,
  messages,
  filteredActions,
  selectedAction,
  withContext,
}: CompletationProviderProps) {
  const [showAiComp, setShowAiComp] = useState(false);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState("");
  const ref = useRef<HTMLElement | null>(null);
  const completationMutation = useCompletation();
  const promptHistory = useRef<{ role: string; content: string }[] | null>(
    null
    //  initialOutput ? {role: 'user', content: `You generated this last output: ${initialOutput}`} : null
  );
  const handleOpenComp = (event: MouseEvent<HTMLButtonElement>) => {
    setShowAiComp(true);
  };

  const handleClose = () => {
    setShowAiComp(false);
    completationMutation.reset();
  };

  const handleCompletation = useCallback(async () => {
    setShowAiComp(true);
  }, []);

  const inputAdornment = useCallback(
    (position: "start" | "end") => {
      return (
        <InputAdornment position={position}>
          <Tooltip
            title={
              <FormattedMessage
                id="ai.completation"
                defaultMessage="AI Completation"
              />
            }
          >
            <IconButton onClick={handleOpenComp}>
              <AutoAwesome />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      );
    },
    [handleOpenComp]
  );

  const getPromptByAction = useCallback(
    (
      prompt: string,
      action: TextImproveAction,
      outputContext?: string | null
    ) => {
      switch (action) {
        case TextImproveAction.GENERATE:
          return `Generate a text based for: "${prompt}".`;
        case TextImproveAction.IMPROVE_WRITING:
          return `Improve text writing for: "${prompt}".`;
        case TextImproveAction.IMPROVE_SPELLING:
          return `Improve text spelling and grammar for: "${prompt}".`;
        case TextImproveAction.MAKE_SHORTER:
          return `Make this text shorter: "${prompt}".`;
        case TextImproveAction.MAKE_LONGER:
          return `Make this text longer: "${prompt}".`;
        case TextImproveAction.GENERATE_CODE:
          return `Generate a JSON (and only a JSON enclosed in brackets) with html, js (optional) and css (optional) code. Return only the JSON and nothing else for"${prompt}". Use max 8000 tokens. ${outputContext ? `Use this JSON code as context: ${outputContext}.` : ""}`;
      }
    },
    []
  );

  const handleGenerate = useCallback(
    async (prompt: string, action?: TextImproveAction, model?: AI_MODEL) => {
      if (action && action === TextImproveAction.GENERATE_IMAGE) {
        setDefaultPrompt(prompt);
        setOpenMediaDialog(true);
      } else if (action) {
        const actionPrompt = promptHistory.current
          ? prompt
          : getPromptByAction(prompt, action, output);

        if (actionPrompt) {
          const promptMessages = messages ||
            promptHistory.current || [
              {
                role: "user",
                content:
                  "You are an assistant. Do not return text with quotes nor special characters.",
              },
            ];

          promptMessages.push({
            role: "user",
            content: actionPrompt,
          });

          await completationMutation.mutateAsync({
            messages: promptMessages,
            action,
            model,
          });

          if (withContext) {
            promptHistory.current = promptMessages;
          }
        }
      }
    },
    [getPromptByAction, setDefaultPrompt, setOpenMediaDialog]
  );

  const handleConfirmCompletation = useCallback(async () => {
    if (completationMutation.data) {
      onCompletation(completationMutation.data?.output);
      handleClose();
    }
  }, [onCompletation, completationMutation.data, handleClose]);

  return (
    <CompletationContext.Provider value={{}}>
      {openMediaDialog && (
        <MediaDialog
          dialogProps={{
            open: openMediaDialog,
            maxWidth: "lg",
            fullWidth: true,
            onClose: () => {
              setOpenMediaDialog(false);
            },
          }}
          defaultAITab="generator"
          showAIGenerator={true}
          defaultPrompt={defaultPrompt}
        />
      )}

      {showAiComp && (
        <CompletationPopover
          open={showAiComp}
          onClose={handleClose}
          anchorEl={document.body}
          onGenerate={handleGenerate}
          output={completationMutation.data?.output || output}
          onConfirm={handleConfirmCompletation}
          initialPrompt={initialPrompt}
          selectedAction={selectedAction}
          multiline={multiline}
          filteredActions={filteredActions}
        />
      )}

      {children({ ref, open: handleCompletation, inputAdornment })}
    </CompletationContext.Provider>
  );
}
