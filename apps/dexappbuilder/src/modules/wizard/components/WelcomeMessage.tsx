import Alert from '@mui/material/Alert';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { DEXKIT_DISCORD_SUPPORT_CHANNEL, WIZARD_DOCS_URL } from 'src/constants';

export function WelcomeMessage() {
  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
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
    >
      {chunks}
    </a>
  );

  return (
    <Alert severity="info">
      <FormattedMessage
        id="wizard.welcome.index.message.dexappbuilder"
        defaultMessage="Welcome to DexAppBuilder! Our beta product is constantly evolving and currently available for free. For support, join our <a>Discord channel</a>. Explore our <d>docs</d> for whitelabels.<br></br> Need a custom solution? Email us at <b>info@dexkit.com</b>. We're here to help!"
        values={{
          //@ts-ignore
          a: handleHrefDiscord,
          //@ts-ignore
          d: handleHrefDocs,
          //@ts-ignore
          b: (chunks) => <b>{chunks}</b>,
          //@ts-ignore
          br: (chunks) => <br />,
        }}
      />
    </Alert>
  );
}
