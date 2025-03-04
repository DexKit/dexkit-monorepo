import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { Formik } from 'formik';

import CodeMirror, { Extension } from '@uiw/react-codemirror';

import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { AppDialogTitle } from '@dexkit/ui';
import { CodePageSection } from '@dexkit/ui/modules/wizard/types/section';
import Fullscreen from '@mui/icons-material/Fullscreen';
import parse from 'html-react-parser';
import { SyntheticEvent, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../ChangeListener';

export interface InputParam {
  name: string;
  value: string;
  extensions: Extension[];
}

export interface CodeSectionFormProps {
  onCancel: () => void;
  onSave: (section: CodePageSection) => void;
  onChange: (section: CodePageSection) => void;
  section?: CodePageSection;
}

function CodeSectionForm({
  onCancel,
  onSave,
  onChange,
  section,
}: CodeSectionFormProps) {
  const handleSubmit = async (values: {
    html: string;
    js: string;
    css: string;
  }) => {
    onSave({ type: 'code-page-section', config: values });
  };

  const handleValidate = (values: {
    html: string;
    js: string;
    css: string;
  }) => {
    try {
      parse(values.html);
    } catch (err) {
      return { html: String(err) };
    }
  };

  const theme = useTheme();

  const [showAsFullScreen, setShowAsFullScreen] = useState<string>();

  const renderInput = (
    { extensions, value, name }: InputParam,
    setFieldValue: (
      name: string,
      value: string,
      shouldValidate?: boolean,
    ) => void,
  ) => {
    return (
      <>
        <CodeMirror
          extensions={extensions}
          theme={theme.palette.mode}
          height="500px"
          value={value}
          onChange={(val) => setFieldValue(name, val)}
        />
      </>
    );
  };

  const renderDialog = (
    inputs: InputParam[],
    setFieldValue: (
      name: string,
      value: string,
      shouldValidate?: boolean,
    ) => void,
    viewAsfullScreen?: string,
  ) => {
    const node = inputs.find((i) => i.name === viewAsfullScreen);

    if (node) {
      return (
        <Dialog open fullWidth maxWidth="xl">
          <AppDialogTitle
            title={
              <FormattedMessage
                id="edit.name.name"
                defaultMessage='Edit "{name}"'
                values={{ name: node.name }}
              />
            }
            onClose={() => setShowAsFullScreen(undefined)}
          />
          <Divider />
          <DialogContent sx={{ p: 0 }}>
            {renderInput(node, setFieldValue)}
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  };

  const renderList = (
    nodes: InputParam[],
    setFieldValue: (
      name: string,
      value: string,
      shouldValidate?: boolean,
    ) => void,
  ) => {
    return (
      <Grid container spacing={2}>
        {nodes.map((node, key) => (
          <Grid item xs={12} key={key}>
            <Card>
              <Box px={2} py={1}>
                <Stack
                  alignItems="center"
                  justifyContent="space-between"
                  direction="row"
                >
                  <Typography>{node.name}</Typography>
                  <IconButton onClick={() => setShowAsFullScreen(node.name)}>
                    <Fullscreen />
                  </IconButton>
                </Stack>
              </Box>
              {renderInput(node, setFieldValue)}
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const [currTab, setCurrTab] = useState('html');

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const renderTabs = (
    nodes: InputParam[],
    setFieldValue: (
      name: string,
      value: string,
      shouldValidate?: boolean,
    ) => void,
  ) => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChangeTab}>
            {nodes.map((node, key) => (
              <Tab label={node.name} value={node.name} key={key} />
            ))}
          </Tabs>
        </Grid>
        {nodes
          .filter((n) => n.name === currTab)
          .map((node, key) => (
            <Grid item xs={12} key={key}>
              <Card>
                <Box px={2} py={1}>
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                  >
                    <Typography>{node.name}</Typography>
                    <IconButton onClick={() => setShowAsFullScreen(node.name)}>
                      <Fullscreen />
                    </IconButton>
                  </Stack>
                </Box>
                {renderInput(node, setFieldValue)}
              </Card>
            </Grid>
          ))}
      </Grid>
    );
  };

  const [showList, setShowList] = useState(false);

  const handleToggle = () => {
    setShowList((value) => !value);
  };

  const inputs = (values: { html: string; js: string; css: string }) => {
    return [
      {
        extensions: [html()],
        name: 'html',
        value: values.html,
      },
      {
        extensions: [javascript({ jsx: false })],
        name: 'js',
        value: values.js,
      },
      {
        extensions: [css()],
        name: 'css',
        value: values.css,
      },
    ];
  };

  return (
    <Formik
      initialValues={{
        html: section?.config.html || '',
        js: section?.config.js || '',
        css: section?.config.css || '',
      }}
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setFieldValue, values, isValid, submitForm }) => (
        <>
          <ChangeListener
            isValid={isValid}
            onChange={(value: any) =>
              onChange({ type: 'code-page-section', config: value })
            }
            values={values}
          />
          {renderDialog(inputs(values), setFieldValue, showAsFullScreen)}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={showList} onClick={handleToggle} />}
                label={
                  <FormattedMessage id="show.all" defaultMessage="Show all" />
                }
              />
            </Grid>
            <Grid item xs={12}>
              {showList
                ? renderList(inputs(values), setFieldValue)
                : renderTabs(inputs(values), setFieldValue)}
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Stack justifyContent="flex-end" direction="row" spacing={1}>
                  <Button onClick={onCancel}>
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </Button>
                  <Button onClick={submitForm} variant="contained">
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Formik>
  );
}

export default function WrappedCodeSectionForm(props: CodeSectionFormProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="h6">
            <FormattedMessage
              id="something.went.wrong"
              defaultMessage="Oops, something went wrong"
              description="Something went wrong error message"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {String(error)}
          </Typography>
          <Button color="primary" onClick={resetErrorBoundary}>
            <FormattedMessage
              id="try.again"
              defaultMessage="Try again"
              description="Try again"
            />
          </Button>
        </Stack>
      )}
    >
      <CodeSectionForm {...props} />
    </ErrorBoundary>
  );
}
