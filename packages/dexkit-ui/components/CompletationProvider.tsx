import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import React, { MouseEvent, useCallback, useRef, useState } from "react";
import CompletationContext from "../context/CompletationContext";

import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { TextImproveAction } from "../constants/ai";
import { useCompletation } from "../hooks/ai";
import { AI_MODEL } from "../types/ai";

const MediaDialog = dynamic(() => import("./mediaDialog"), {
  ssr: false,
});

const CompletationPopover = dynamic(() => import("./CompletationPopover"), {
  ssr: false,
});

export interface CompletationProviderProps {
  children: ({}: {
    ref: React.MutableRefObject<HTMLElement | null>;
    inputAdornment: (position: "start" | "end") => React.ReactNode;
    open: () => void;
  }) => React.ReactNode;
  onCompletation: (output: string) => void;
  initialPrompt?: string;
  multiline?: boolean;
  messages?: { role: string; content: string }[];
  filteredActions?: TextImproveAction[];
}

export default function CompletationProvider({
  children,
  onCompletation,
  initialPrompt,
  multiline,
  messages,
  filteredActions,
}: CompletationProviderProps) {
  const [showAiComp, setShowAiComp] = useState(false);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);
  const completationMutation = useCompletation();

  const handleOpenComp = (event: MouseEvent<HTMLButtonElement>) => {
    setShowAiComp(true);
  };

  const handleClose = () => {
    setShowAiComp(false);
    completationMutation.reset();
  };

  const handleCompletation = useCallback(async () => {
    setShowAiComp(true);
  }, [handleOpenComp]);

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
    (prompt: string, action: TextImproveAction) => {
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
          return `Generate html, js and css code and make it a formatted JSON for: "${prompt}".`;
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
        const actionPrompt = getPromptByAction(prompt, action);

        if (actionPrompt) {
          const promptMessages = messages
            ? [...messages, { role: "user", content: actionPrompt }]
            : [
                {
                  role: "user",
                  content:
                    "You are an assistant. Do not return text with quotes",
                },
                { role: "user", content: actionPrompt },
              ];

          await completationMutation.mutateAsync({
            messages: promptMessages,
            action,
            model,
          });
        }
      }
    },
    [getPromptByAction, setDefaultPrompt, setOpenMediaDialog]
  );

  const handleConfirmCompletation = useCallback(async () => {
    if (completationMutation.data) {
      debugger;
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
          anchorEl={ref.current}
          onGenerate={handleGenerate}
          output={completationMutation.data?.output}
          onConfirm={handleConfirmCompletation}
          initialPrompt={initialPrompt}
          multiline={multiline}
          filteredActions={filteredActions}
        />
      )}
      {children({ ref, open: handleCompletation, inputAdornment })}
    </CompletationContext.Provider>
  );
}
