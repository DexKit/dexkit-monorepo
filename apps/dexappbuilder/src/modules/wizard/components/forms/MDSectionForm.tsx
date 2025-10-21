import { useIsMobile } from '@dexkit/core';
import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import {
  AppPageSection,
  MarkdownEditorPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import '@uiw/react-markdown-preview/markdown.css';
import { ExecuteState, TextAreaTextApi } from '@uiw/react-md-editor';

import * as commands from '@uiw/react-md-editor/commands';

import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

interface Props {
  section?: MarkdownEditorPageSection;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
}

export default function MDSectionForm({
  section,
  onSave,
  onCancel,
  onChange,
}: Props) {
  const [value, setValue] = useState<string | undefined>(
    section?.config?.source,
  );
  const isMobile = useIsMobile();
  const theme = useTheme();

  useEffect(() => {
    onChange({
      ...section,
      type: 'markdown',
      config: { source: value },
    });
  }, [value]);

  const { formatMessage } = useIntl();
  const [initialPrompt, setInitialPrompt] = useState('');

  const [textPos, setTextPos] = useState({ before: '', after: '' });

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <Paper sx={{ p: isMobile ? theme.spacing(1.5) : theme.spacing(2) }}>
          <Grid container spacing={isMobile ? theme.spacing(1.5) : theme.spacing(2)}>
            <Grid size={12}>
              <CompletationProvider
                onCompletation={(output: string) => {
                  setValue(`${textPos.before}${output}${textPos.after}`);
                }}
                multiline
                messages={[
                  {
                    role: 'system',
                    content: 'You are a helpful markdown editor assistant.',
                  },
                  {
                    role: 'user',
                    content:
                      'Only return the result of what I ask. Do not return quotes for the results',
                  },
                ]}
                initialPrompt={initialPrompt}
              >
                {({ open, ref }) => (
                  <MDEditor
                    value={value}
                    onChange={setValue}
                    ref={ref}
                    height={350}
                    commands={[
                      ...commands.getCommands(),
                      {
                        keyCommand: 'ai',
                        name: formatMessage({
                          id: 'artificial.inteligence',
                          defaultMessage: 'Artificial Inteligence',
                        }),

                        render: (command: any, disabled: any, executeCommand: any) => {
                          return (
                            <button
                              disabled={disabled}
                              onClick={(evn) => {
                                // evn.stopPropagation();
                                executeCommand(command, command.groupName);
                              }}
                            >
                              <AutoAwesome fontSize="inherit" />
                            </button>
                          );
                        },
                        icon: <AutoAwesome fontSize="inherit" />,
                        execute: async (
                          state: ExecuteState,
                          api: TextAreaTextApi,
                        ) => {
                          open();

                          setInitialPrompt(state.selectedText);

                          const before = state.text.substring(
                            0,
                            state.selection.start,
                          );

                          const after = state.text.substring(
                            state.selection.end,
                            state.text.length,
                          );

                          setTextPos({ before, after });
                        },
                      },
                    ]}
                  />
                )}
              </CompletationProvider>
            </Grid>
            <Grid size={12}>
              <Stack
                spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}
                direction="row"
                justifyContent="flex-end"
                sx={{ mt: isMobile ? theme.spacing(1) : theme.spacing(2) }}
              >
                <Button onClick={onCancel} size={isMobile ? "small" : "medium"}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  onClick={() =>
                    onSave({
                      ...section,
                      type: 'markdown',
                      config: { source: value },
                    })
                  }
                  variant="contained"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}
