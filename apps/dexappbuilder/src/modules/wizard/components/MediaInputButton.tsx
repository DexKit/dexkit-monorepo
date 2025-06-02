import { getNormalizedUrl } from '@dexkit/core/utils';
import IpfsMediaDialog from '@dexkit/web3forms/components/IpfsMediaDialog';
import { useIpfsFileListQuery } from '@dexkit/web3forms/hooks';
import ImageIcon from '@mui/icons-material/Image';
import { Box, ButtonBase, Stack, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface MediaInputButtonProps {
  name: string;
  label: string;
}

export function MediaInputButton({ name, label }: MediaInputButtonProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  const [showDialog, setShowDialog] = useState(false);

  const handleToggle = () => {
    setShowDialog((value) => !value);
    setFieldValue(name, undefined);
  };

  const handleSelect = (url: string) => {
    setFieldValue(name, url);
    setShowDialog(false);
  };

  const ipfsFileListQuery = useIpfsFileListQuery({ page: 1, onlyImages: true });

  const theme = useTheme();

  return (
    <>
      <IpfsMediaDialog
        DialogProps={{
          open: showDialog,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: handleToggle,
        }}
        images={
          ipfsFileListQuery.data
            ? ipfsFileListQuery.data.pages
                .map((p) => p.items.map((f) => f))
                .flat()
            : []
        }
        hasMore={ipfsFileListQuery.hasNextPage}
        onSelect={handleSelect}
        isLoading={ipfsFileListQuery.isLoading}
        onLoadMore={() => ipfsFileListQuery.fetchNextPage()}
      />

      <ButtonBase
        onClick={handleToggle}
        sx={{
          display: 'block',
          height: '100%',
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: '50%',
        }}
      >
        {values[name] ? (
          <img
            src={getNormalizedUrl(values[name])}
            alt=""
            style={{
              border: `1px solid ${theme.palette.divider}`,
              display: 'block',
              height: '100%',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '50%',
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'block',
              height: '100%',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: '100%',
                width: '100%',
                color: (theme) => theme.palette.text.secondary,
              }}
              alignContent="center"
            >
              <ImageIcon color="inherit" />
              <Typography color="inherit" variant="caption">
                <FormattedMessage id="image" defaultMessage="Image" />
              </Typography>
            </Stack>
          </Box>
        )}
      </ButtonBase>
    </>
  );
}
