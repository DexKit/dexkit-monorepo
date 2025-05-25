import { useIsMobile } from '@dexkit/core';
import { Stack, Typography, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { SiteResponse } from '@dexkit/ui/modules/wizard/types/config';
import { useSendSiteConfirmationLinkMutation } from '../hooks';

const ActionMutationDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/ActionMutationDialog'),
);

export function ConfirmationEmailMessage({
  site,
}: {
  site?: SiteResponse | null;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const siteConfirmationMutation = useSendSiteConfirmationLinkMutation();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleHere = (chunks: any): ReactNode => (
    <a
      href={''}
      onClick={(e) => {
        e.preventDefault();
        setOpen(true);
        siteConfirmationMutation.mutate({ siteId: site?.id });
      }}
      style={{
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        textDecoration: 'underline'
      }}
    >
      {chunks}
    </a>
  );

  return (
    <>
      {open && (
        <ActionMutationDialog
          dialogProps={{
            open: open,
            onClose: () => {
              siteConfirmationMutation.reset();
              setOpen(false);
            },
            fullWidth: true,
            maxWidth: 'sm',
          }}
          isSuccess={siteConfirmationMutation.isSuccess}
          isLoading={siteConfirmationMutation.isLoading}
          isError={siteConfirmationMutation.isError}
          error={siteConfirmationMutation.error}
        />
      )}

      <Alert
        severity="warning"
        sx={{
          '& .MuiAlert-icon': {
            fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.h6.fontSize,
            marginRight: isMobile ? theme.spacing(0.5) : theme.spacing(1),
            alignItems: 'center',
            padding: isMobile ? theme.spacing(1, 0) : undefined
          },
          padding: isMobile ? theme.spacing(0, 1) : undefined
        }}
      >
        <Stack
          direction={'row'}
          alignContent={'center'}
          alignItems={'center'}
          spacing={isMobile ? 1 : 2}
        >
          <Typography
            variant={isMobile ? 'caption' : 'body2'}
            sx={{
              fontSize: isMobile ? theme.typography.caption.fontSize : undefined,
              lineHeight: isMobile ? 1.3 : undefined
            }}
          >
            <FormattedMessage
              id="site.email.not.verified.on.admin.message"
              defaultMessage="Your app email is not verified. Please verify it using the verification email we sent.
              If you haven't received the email or need it sent again, request a confirmation email <a>here</a>"
              values={{
                //@ts-ignore
                a: handleHere,
              }}
            />
          </Typography>
        </Stack>
      </Alert>
    </>
  );
}
