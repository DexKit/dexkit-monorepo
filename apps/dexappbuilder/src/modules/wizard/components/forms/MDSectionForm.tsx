import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import {
  AppPageSection,
  MarkdownEditorPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
              commands={[
                ...commands.getCommands(),
                {
                  keyCommand: 'ai',
                  name: formatMessage({
                    id: 'artificial.inteligence',
                    defaultMessage: 'Artificial Inteligence',
                  }),

                  render: (command, disabled, executeCommand) => {
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
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button onClick={onCancel}>
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
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
