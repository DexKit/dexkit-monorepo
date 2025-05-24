import { useIsMobile } from '@dexkit/core';
import { Stack, Typography, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { DEXKIT_DISCORD_SUPPORT_CHANNEL, WIZARD_DOCS_URL } from 'src/constants';

export function WelcomeMessage() {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
      style={{
        color: theme.palette.info.light,
        fontWeight: 'bold',
        textDecoration: 'underline'
      }}
    >
      {chunks}
    </a>
  );

  const handleHrefDocs = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={WIZARD_DOCS_URL}
      rel="noreferrer"
      style={{
        color: theme.palette.info.light,
        fontWeight: 'bold',
        textDecoration: 'underline'
      }}
    >
      {chunks}
    </a>
  );

  return (
    <Alert
      severity="info"
      sx={{
        '& .MuiAlert-icon': {
          fontSize: isMobile ? '1rem' : '1.25rem',
          marginRight: isMobile ? 0.5 : 1,
          alignItems: 'center',
          padding: isMobile ? '8px 0' : undefined
        },
        padding: isMobile ? '0 8px' : undefined,
        color: theme.palette.mode === 'dark' ? theme.palette.info.light : undefined
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
            fontSize: isMobile ? '0.75rem' : undefined,
            lineHeight: isMobile ? 1.3 : undefined,
            color: theme.palette.mode === 'dark' ? theme.palette.info.light : undefined
          }}
        >
      <FormattedMessage
        id="wizard.welcome.index.message.dexappbuilder"
        defaultMessage="Welcome to DexAppBuilder! Our beta product is constantly evolving and currently available for free. For support, join our <a>Discord channel</a>. Explore our <d>docs</d> for whitelabels.<br></br> Need a custom solution? Email us at <b>info@dexkit.com</b>. We're here to help!"
        values={{
          //@ts-ignore
          a: handleHrefDiscord,
          //@ts-ignore
          d: handleHrefDocs,
          //@ts-ignore
              b: (chunks) => <b style={{ color: theme.palette.info.light }}>{chunks}</b>,
          //@ts-ignore
          br: (chunks) => <br />,
        }}
      />
        </Typography>
      </Stack>
    </Alert>
  );
}
