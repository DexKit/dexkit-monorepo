import ContractButton from '@/modules/forms/components/ContractButton';
import Link from '@dexkit/ui/components/AppLink';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { THIRDWEB_ICON_URL } from '@dexkit/web3forms/constants';
import WalletIcon from '@mui/icons-material/Wallet';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { useConnectWalletDialog } from 'src/hooks/app';

const THIRDWEB_CONTRACT_LIST: {
  name: string;
  description: string;
  publisherIcon: string;
  publisherName: string;
  slug: string;
}[] = [
  {
    name: 'Token',
    description:
      'The Token contract is suited for creating a digital currency and is compliant with the ERC20 standard.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'TokenERC20',
  },
  {
    name: 'StakeERC721',
    description:
      'This contract allows users to stake their ERC-721 NFTs and get ERC-20 tokens as staking rewards.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'NFTStake',
  },
  {
    name: 'Marketplace',
    description:
      'A Marketplace is a contract where you can buy and sell NFTs, such as OpenSea or Rarible.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'MarketplaceV3',
  },
  {
    name: 'NFT Drop',
    description:
      'The NFT Drop contract is ideal when you want to release a collection of unique NFTs using the ERC721A Standard.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'DropERC721',
  },
];

export default function FormsPage() {
  const router = useRouter();

  const handleCreateCustom = () => {
    router.push('/forms/create');
  };

  const { account, isActive } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => connectWalletDialog.setOpen(true);

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage
                    id="dexgenerator"
                    defaultMessage="DexGenerator"
                  />
                ),
                uri: '/forms',
                active: true,
              },
            ]}
          />
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Box>
                        <Typography variant="h4">
                          <FormattedMessage
                            id="web3forms.deplopy"
                            defaultMessage="DexGenerator"
                          />
                        </Typography>
                        {/* <Typography variant="body1" color="text.secondary">
                          <FormattedMessage
                            id="explore.our.new.tool.dexgenerator"
                            defaultMessage="Explore our new tool: DexGenerator"
                          />
          </Typography>*/}
                      </Box>
                    </Grid>
                    <Grid item>
                      <Stack direction="row" spacing={2}>
                        <Button
                          LinkComponent={Link}
                          href="/forms/contracts/list"
                          variant="outlined"
                        >
                          <FormattedMessage
                            id="manage.contracts"
                            defaultMessage="Manage Contracts"
                          />
                        </Button>
                        {isActive ? (
                          <Button
                            LinkComponent={Link}
                            href={`/forms/account/${account}`}
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="manage.forms"
                              defaultMessage="Manage Forms"
                            />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleConnectWallet}
                            variant="outlined"
                            startIcon={<WalletIcon />}
                          >
                            <FormattedMessage
                              id="connect.wallet"
                              defaultMessage="Connect wallet"
                            />
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="create.forms"
                    defaultMessage="Create forms"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <ContractButton
                      onClick={handleCreateCustom}
                      title={
                        <FormattedMessage id="custom" defaultMessage="Custom" />
                      }
                      description={
                        <FormattedMessage
                          id="create.custom.form"
                          defaultMessage="Create custom form"
                        />
                      }
                      creator={{
                        imageUrl:
                          'https://raw.githubusercontent.com/DexKit/assets/main/images/logo_256x256.png',
                        name: 'DexKit',
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/*   <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="forms.by.the.community"
                    defaultMessage="Forms by the community"
                  />
                </Typography>
                    </Grid>*/}
              {/*   <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TipsAndUpdates fontSize="large" />
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="coming.soon"
                          defaultMessage="Coming soon"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="text.secondary"
                      >
                        <FormattedMessage
                          id="forms.by.the.community.will.be.available.soon"
                          defaultMessage="Forms by the community will be available soon"
                        />
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                    </Grid>*/}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
