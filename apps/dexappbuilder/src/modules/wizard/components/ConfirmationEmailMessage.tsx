import { Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';
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

  const handleHere = (chunks: any): ReactNode => (
    <a
      href={''}
      onClick={(e) => {
        e.preventDefault();
        setOpen(true);
        siteConfirmationMutation.mutate({ siteId: site?.id });
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

      <Alert severity="warning">
        <Stack
          direction={'row'}
          alignContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Typography variant={'body2'}>
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
