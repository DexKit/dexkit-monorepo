import Link from '@dexkit/ui/components/AppLink';
import { ConnectButton } from '@dexkit/ui/components/ConnectButton';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import ContractButton from '@dexkit/ui/modules/contract-wizard/components/ContractButton';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { THIRDWEB_ICON_URL } from '@dexkit/web3forms/constants';
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
            <Stack spacing={3}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    <FormattedMessage
                      id="web3forms.deplopy"
                      defaultMessage="DexGenerator"
                    />
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    <FormattedMessage
                      id="create.forms"
                      defaultMessage="Create forms"
                    />
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    LinkComponent={Link}
                    href="/forms/contracts/list"
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: 'white',
                      borderColor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        backgroundColor: 'white',
                      }
                    }}
                  >
                    <FormattedMessage
                      id="manage.contracts"
                      defaultMessage="MANAGE CONTRACTS"
                    />
                  </Button>
                  {isActive ? (
                    <Button
                      LinkComponent={Link}
                      href={`/forms/account/${account}`}
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor: 'white',
                        borderColor: 'primary.light',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          backgroundColor: 'white',
                        }
                      }}
                    >
                      <FormattedMessage
                        id="manage.forms"
                        defaultMessage="MANAGE FORMS"
                      />
                    </Button>
                  ) : (
                    <ConnectButton variant="outlined" />
                  )}
                </Stack>
              </Stack>

              <Box sx={{ maxWidth: '400px' }}>
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
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
