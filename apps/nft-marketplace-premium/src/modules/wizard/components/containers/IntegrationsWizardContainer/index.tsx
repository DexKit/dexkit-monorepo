import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
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
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        <FormattedMessage id="0x.api" defaultMessage="0x API" />
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage
                          id="0x.is.a.decentralized.exchange.protocol.description"
                          defaultMessage="0x is a decentralized exchange protocol on Ethereum, enabling peer-to-peer trading of various digital assets through open standards and smart contracts."
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <ZrxForm siteId={siteId} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        <FormattedMessage
                          id="darkblock"
                          defaultMessage="Darkblock"
                        />
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage
                          id="darkblock.one.line.description"
                          defaultMessage="Darkblock is a decentralized protocol that allows content creators to publish and distribute exclusive content to their fans without the need for centralized token-gating platforms."
                        />
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
