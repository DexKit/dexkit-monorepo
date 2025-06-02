import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';

import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
import DarkblockForm from './DarkblockForm';
const ZrxForm = dynamic(() => import('./ZrxForm'));

export interface IntegrationsWizardContainerProps {
  siteId?: number;
}

export default function IntegrationsWizardContainer({
  siteId,
}: IntegrationsWizardContainerProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage
                id="integrations"
                defaultMessage="Integrations"
              />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="set.integrations.settings.for.your.app"
                defaultMessage="Integration settings for your app."
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                {/* <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        <FormattedMessage id="0x.api" defaultMessage="0x API" />
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        <FormattedMessage
                          id="0x.is.a.decentralized.exchange.protocol.description"
                          defaultMessage="0x is a decentralized exchange protocol on Ethereum, enabling peer-to-peer trading of various digital assets through open standards and smart contracts. This API key is used for the swap and limit order features."
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage
                          id="access.the.0x.dashboard.to.get.your.api.key"
                          defaultMessage="Access the 0x dashboard to get your API Key"
                        />
                        :{' '}
                        <Link target="_blank" href="https://dashboard.0x.org/">
                          <FormattedMessage
                            id="0x.dashboard"
                            defaultMessage="0x Dashboard"
                          />
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <ZrxForm siteId={siteId} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
  </Grid>*/}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        <FormattedMessage
                          id="darkblock"
                          defaultMessage="Darkblock"
                        />
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        <FormattedMessage
                          id="darkblock.one.line.description"
                          defaultMessage="Darkblock is a decentralized protocol that allows content creators to publish and distribute exclusive content to their fans without the need for centralized token-gating platforms. This integration is utilized on the Asset page for the networks supported by Darkblock."
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage
                          id="access.darkblock.to.get.more.information"
                          defaultMessage="Access darkblock to get more information"
                        />
                        :{' '}
                        <Link target="_blank" href="https://darkblock.io/">
                          <FormattedMessage
                            id="darkblock.io"
                            defaultMessage="Darkblock.io"
                          />
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <DarkblockForm siteId={siteId} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
