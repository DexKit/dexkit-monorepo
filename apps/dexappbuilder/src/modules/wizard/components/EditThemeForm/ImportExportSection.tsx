import { Box, Button, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useRef } from 'react';

import { ThemeType } from '@dexkit/ui/types/theme';
import { parseTheme } from '@dexkit/ui/utils/theme';
import { ThemeFormType } from '../../types';
import { mapObject } from '../../utils';

export interface ImportExportSectionProps {
  theme: ThemeFormType;
  onImport: (theme: ThemeFormType) => void;
}

export default function ImportExportSection({
  theme,
  onImport,
}: ImportExportSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      let file = e.target.files[0];

      let fileReader = new FileReader();

      fileReader.readAsText(file);

      fileReader.onload = (d) => {
        try {
          const data = JSON.parse(fileReader.result as string);
          let impTheme = parseTheme(data);

          if (impTheme.palette.type === 'simple') {
            let newTheme: ThemeFormType = { themeId: theme.themeId };

            mapObject(newTheme, impTheme.palette.colors, {
              background: 'background',
              error: 'error',
              primary: 'primary',
              secondary: 'secondary',
              info: 'info',
              success: 'success',
              warning: 'warning',
              text: 'text',
            });

            onImport(newTheme);
          }
        } catch (err) {
          enqueueSnackbar(String(err), { variant: 'error' });
        }
      };
    }
  };

  const handleExport = () => {
    const exportedTheme: ThemeType = {
      shape: {
        borderRadius: 1,
      },
      palette: {
        type: 'simple',
        colors: {},
      },
    };

    if (exportedTheme.palette.type === 'simple') {
      mapObject(exportedTheme.palette.colors, theme, {
        primary: 'primary',
        background: 'background',
        error: 'error',
        success: 'success',
        secondary: 'secondary',
        warning: 'warning',
        info: 'info',
        text: 'text',
      });
    }

    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportedTheme));
    var dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'theme.json');
    dlAnchorElem.click();
  };

  return (
    <>
      <input
        type="file"
        ref={(ref) => (fileInputRef.current = ref)}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Box>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleUpload}
            variant="outlined"
            startIcon={<FileUploadIcon />}
          >
            <FormattedMessage id="import" defaultMessage="Import" />
          </Button>
          <Button
            onClick={handleExport}
            variant="outlined"
            startIcon={<FileDownloadIcon />}
          >
            <FormattedMessage id="Export" defaultMessage="Export" />
          </Button>
        </Stack>
      </Box>
    </>
  );
}
