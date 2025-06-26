import { ThemeMode } from "@dexkit/ui/constants/enum";
import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import {
  appConfigSchema,
  widgetConfigSchema,
} from "@dexkit/ui/modules/wizard/types/schema";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ImportAppConfigDialogProps {
  DialogProps: DialogProps;
  isWidget?: boolean;
  onImport: (config: AppConfig, shouldRedirect?: boolean) => void;
  currentConfig?: AppConfig;
  redirectAfterImport?: boolean;
}

export default function ImportAppConfigDialog({
  DialogProps,
  onImport,
  isWidget,
  currentConfig,
  redirectAfterImport = true,
}: ImportAppConfigDialogProps) {
  const { formatMessage } = useIntl();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonContent, setJsonContent] = useState<string | null>(null);
  const [validatedConfig, setValidatedConfig] = useState<AppConfig | null>(
    null
  );
  const [originalJsonData, setOriginalJsonData] = useState<any>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setIsLoading(true);

      try {
        const file = event.target.files?.[0];
        if (!file) {
          setError(
            formatMessage({
              id: "no.file.selected",
              defaultMessage: "No file selected",
            })
          );
          setIsLoading(false);
          return;
        }

        if (file.type !== "application/json" && !file.name.endsWith(".json")) {
          setError(
            formatMessage({
              id: "file.must.be.json",
              defaultMessage: "File must be JSON",
            })
          );
          setIsLoading(false);
          return;
        }

        const fileContent = await file.text();
        setJsonContent(fileContent);

        try {
          const jsonData = JSON.parse(fileContent);
          setOriginalJsonData(jsonData);

          const result = isWidget
            ? widgetConfigSchema.safeParse(jsonData)
            : appConfigSchema.safeParse(jsonData);
          if (!result.success) {
            setError(
              formatMessage({
                id: "invalid.config.format",
                defaultMessage: "Invalid configuration format",
              }) +
                ": " +
                result.error.message
            );
            setValidatedConfig(null);
          } else {
            const configData = { ...result.data };

            if (configData.defaultThemeMode) {
              configData.defaultThemeMode =
                configData.defaultThemeMode as ThemeMode;
            }

            if (configData.themeMode) {
              configData.themeMode = configData.themeMode as ThemeMode;
            }

            setValidatedConfig(configData as AppConfig);
            setError(null);
          }
        } catch (err) {
          setError(
            formatMessage({
              id: "invalid.json.format",
              defaultMessage: "Invalid JSON format",
            })
          );
          setValidatedConfig(null);
        }
      } catch (err) {
        setError(
          formatMessage({
            id: "error.reading.file",
            defaultMessage: "Error reading file",
          })
        );
        setValidatedConfig(null);
      } finally {
        setIsLoading(false);
      }
    },
    [formatMessage, isWidget]
  );

  const handleImport = useCallback(() => {
    if (validatedConfig && currentConfig) {
      try {
        if (originalJsonData) {
          const finalConfig = JSON.parse(JSON.stringify(originalJsonData));

          if (!isWidget) {
            finalConfig.email = currentConfig.email;
            finalConfig.domain = currentConfig.domain;
          }
          finalConfig.name = currentConfig.name;
          finalConfig.hide_powered_by = currentConfig.hide_powered_by;

          onImport(finalConfig, redirectAfterImport);
        } else {
          const finalConfig = { ...validatedConfig };

          finalConfig.name = currentConfig.name;
          finalConfig.hide_powered_by = currentConfig.hide_powered_by;

          onImport(finalConfig, redirectAfterImport);
        }
      } catch (err) {
        console.error("Error processing JSON configuration:", err);
        const finalConfig = { ...validatedConfig };
        if (!isWidget) {
          finalConfig.email = currentConfig.email;
          finalConfig.domain = currentConfig.domain;
        }
        finalConfig.name = currentConfig.name;
        finalConfig.hide_powered_by = currentConfig.hide_powered_by;

        onImport(finalConfig, redirectAfterImport);
      }
    } else if (validatedConfig) {
      if (originalJsonData) {
        onImport(originalJsonData, redirectAfterImport);
      } else {
        onImport(validatedConfig, redirectAfterImport);
      }
    }
  }, [
    onImport,
    validatedConfig,
    currentConfig,
    redirectAfterImport,
    originalJsonData,
    isWidget,
  ]);

  return (
    <Dialog {...DialogProps}>
      <DialogTitle>
        {isWidget ? (
          <FormattedMessage
            id="import.widget.configuration"
            defaultMessage="Import Widget Configuration"
          />
        ) : (
          <FormattedMessage
            id="import.app.configuration"
            defaultMessage="Import App Configuration"
          />
        )}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isWidget ? (
            <FormattedMessage
              id="import.widget.configuration.description"
              defaultMessage="Select a JSON file containing the Widget configuration to import. The file must have a valid configuration format."
            />
          ) : (
            <FormattedMessage
              id="import.app.configuration.description"
              defaultMessage="Select a JSON file containing the DApp configuration to import. The file must have a valid configuration format."
            />
          )}
        </DialogContentText>
        <Stack spacing={2} mt={2}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<FileUploadIcon />}
            disabled={isLoading}
          >
            <FormattedMessage id="select.file" defaultMessage="Select File" />
            <input
              type="file"
              accept=".json,application/json"
              hidden
              onChange={handleFileChange}
              onClick={(e) => {
                (e.target as HTMLInputElement).value = "";
              }}
            />
          </Button>
          {isLoading && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              mt={1}
            >
              <CircularProgress size={20} />
              <Typography variant="body2">
                <FormattedMessage
                  id="processing.file"
                  defaultMessage="Processing file..."
                />
              </Typography>
            </Stack>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {validatedConfig && !error && !isLoading && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <FormattedMessage
                id="config.valid.ready.to.import"
                defaultMessage="Configuration valid and ready to import"
              />
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={DialogProps.onClose as () => void}
          disabled={isLoading}
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button
          onClick={handleImport}
          color="primary"
          variant="contained"
          disabled={!validatedConfig || isLoading}
        >
          <FormattedMessage id="import" defaultMessage="Import" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
