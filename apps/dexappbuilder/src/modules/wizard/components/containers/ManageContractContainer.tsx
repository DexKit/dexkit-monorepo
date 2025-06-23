import { ContractContainer } from '@/modules/contract-wizard/components/containers/ContractContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import ThirdwebV4Provider from '@dexkit/ui/providers/ThirdwebV4Provider';
import {
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  address: string;
  network: string;
  onGoBack: () => void;
}

export default function ManageContractContainer({
  address,
  network,
  onGoBack,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThirdwebV4Provider chainId={NETWORK_FROM_SLUG(network as string)?.chainId}>
      <Container>
        <Grid container spacing={isMobile ? 1.5 : 3}>
          <Grid item xs={12}>
            <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                  fontSize: isMobile ? '1.15rem' : '1.5rem',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                <FormattedMessage
                  id="manage.contract"
                  defaultMessage="Manage Contract"
                />
              </Typography>
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color="text.secondary"
                sx={{
                  fontSize: isMobile ? '0.85rem' : 'inherit',
                }}
              >
                <FormattedMessage
                  id="contract.management.description"
                  defaultMessage="View and manage your contract details"
                />
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <ContractContainer
              address={address as string}
              network={network as string}
              showPageHeader={true}
              onGoBack={onGoBack}
            />
          </Grid>
        </Grid>
      </Container>
    </ThirdwebV4Provider>
  );
}
