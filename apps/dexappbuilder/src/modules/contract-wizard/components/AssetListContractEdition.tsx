import { Asset } from '@dexkit/core/types/nft';
import EvmBurnNftDialog from '@dexkit/ui/modules/evm-burn-nft/components/dialogs/EvmBurnNftDialog';
import EvmTransferNftDialog from '@dexkit/ui/modules/evm-transfer-nft/components/dialogs/EvmTransferNftDialog';
import { AssetMedia } from '@dexkit/ui/modules/nft/components/AssetMedia';
import { BaseAssetCard } from '@dexkit/ui/modules/nft/components/BaseAssetCard';
import { useAsset } from '@dexkit/ui/modules/nft/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SendIcon from '@mui/icons-material/Send';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
    Alert,
    Box,
    Button,
    Grid,
    Pagination,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAssetListFromCollection } from '../../../hooks/collection';
import { ClaimConditionsContainer } from './containers/ClaimConditionsContainer';

interface Props {
  contractAddress: string;
  network: string;
  search?: string;
  showClaimConditions?: boolean;
}

function a11yProps(index: number) {
  return {
    id: `nft-tab-${index}`,
    'aria-controls': `nft-tabpanel-${index}`,
  };
}

export function AssetListContractEdition({
  contractAddress,
  search,
  network,
  showClaimConditions,
}: Props) {
  const router = useRouter();
  const { chainId, account, provider } = useWeb3React();
  const [asset, setAsset] = useState<Asset | undefined>();
  const [tabValue, setTabValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [openTransferDialog, setOpenTransferDialog] = useState<boolean>(false);
  const [openBurnDialog, setOpenBurnDialog] = useState<boolean>(false);
  const [assetTransfer, setAssetTransfer] = useState<Asset | undefined>();
  const assetToTransfer = useAsset(
    assetTransfer?.contractAddress,
    assetTransfer?.id,
    undefined,
    true,
    assetTransfer?.chainId,
  );

  const { data: assetSelected, isLoading: isLoadingAsset } = useAsset(
    asset?.contractAddress,
    asset?.id,
    undefined,
    true,
    asset?.chainId,
  );

  const onTransfer = (asset: Asset) => {
    setAssetTransfer(asset);
  };

  const { data } = useAssetListFromCollection({
    network,
    address: contractAddress,
    skip: page * perPage,
    take: perPage,
    traitsFilter: router.query['traitsFilter'] as string | undefined,
  });
  const assets = data?.assets;

  const filteredAssets = useMemo(() => {
    if (assets && search) {
      return assets.filter(
        (a) =>
          a.collectionName.indexOf(search) !== -1 ||
          a.metadata?.name.indexOf(search) !== -1,
      );
    }

    return assets;
  }, [search, assets]);

  return (
    <>
      {assetTransfer !== undefined && openTransferDialog && (
        <EvmTransferNftDialog
          DialogProps={{
            open: assetTransfer !== undefined && openTransferDialog,
            onClose: () => {
              setAssetTransfer(undefined);
              setOpenTransferDialog(false);
            },
            fullWidth: true,
            maxWidth: 'sm',
          }}
          params={{
            chainId: chainId,
            account: account,
            provider: provider,
            contractAddress: assetToTransfer.data?.contractAddress,
            tokenId: assetToTransfer.data?.id,
            isLoadingNft: assetToTransfer.isLoading,
            nft: assetToTransfer?.data || assetTransfer,
            nftMetadata:
              assetToTransfer?.data?.metadata || assetTransfer.metadata,
          }}
        />
      )}
      {assetTransfer !== undefined && openBurnDialog && (
        <EvmBurnNftDialog
          DialogProps={{
            open: assetTransfer !== undefined && openBurnDialog,
            onClose: () => {
              setAssetTransfer(undefined);
              setOpenBurnDialog(false);
            },
            fullWidth: true,
            maxWidth: 'sm',
          }}
          params={{
            chainId: chainId,
            account: account,
            contractAddress: assetToTransfer.data?.contractAddress,
            tokenId: assetToTransfer.data?.id,
            isLoadingNft: assetToTransfer.isLoading,
            nft: assetToTransfer?.data || assetTransfer,
            nftMetadata:
              assetToTransfer?.data?.metadata || assetTransfer.metadata,
          }}
        />
      )}

      {asset !== undefined && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setAsset(undefined)}
            >
              <FormattedMessage
                id={'back.to.nft.list'}
                defaultMessage={'Back to NFT List'}
              />{' '}
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h6">{asset.metadata?.name || ''}</Typography>
            <Box sx={{ maxWidth: '150px' }}>
              <AssetMedia asset={asset} />
            </Box>
            <Typography>{asset.metadata?.description || ''}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Stack spacing={2}>
              <Typography>
                <FormattedMessage id={'you.own'} defaultMessage={'You own'} />:{' '}
                {isLoadingAsset ? ' ' : assetSelected?.balance?.toString() || 0}
              </Typography>
              <Stack spacing={2} direction={'row'}>
                {isLoadingAsset ? (
                  <Skeleton>
                    <Button>
                      <FormattedMessage
                        id="view.nft"
                        defaultMessage={'View nft'}
                      />
                    </Button>
                  </Skeleton>
                ) : (
                  <Button
                    href={`/asset/${network}/${assetSelected?.contractAddress}/${assetSelected?.id}`}
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                  >
                    <FormattedMessage
                      id="view.nft"
                      defaultMessage={'View nft'}
                    />
                  </Button>
                )}
                {isLoadingAsset ? (
                  <Skeleton>
                    <Button>
                      <FormattedMessage
                        id="view.nft.drop"
                        defaultMessage={'View nft drp'}
                      />
                    </Button>
                  </Skeleton>
                ) : (
                  <Button
                    href={`/drop/edition/${network}/${assetSelected?.contractAddress}/${assetSelected?.id}`}
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                  >
                    <FormattedMessage
                      id="view.nft.drop"
                      defaultMessage={'View nft drop'}
                    />
                  </Button>
                )}

                <Button
                  startIcon={<SendIcon />}
                  variant="contained"
                  disabled={assetSelected?.balance?.eq(0) || isLoadingAsset}
                  sx={{ maxWidth: '200px' }}
                  onClick={() => {
                    setOpenTransferDialog(true);
                    setAssetTransfer(assetSelected);
                  }}
                >
                  <FormattedMessage
                    id="transfer.nft"
                    defaultMessage={'Transfer NFT'}
                  />
                </Button>
                {/*   <Button
                  startIcon={<WhatshotIcon />}
                  variant="contained"
                  disabled={assetSelected?.balance?.eq(0) || isLoadingAsset}
                  sx={{ maxWidth: '200px' }}
                  onClick={() => {
                    setOpenBurnDialog(true);
                    setAssetTransfer(assetSelected);
                  }}
                >
                  <FormattedMessage id="burn.nft" defaultMessage={'Burn NFT'} />
                </Button>*/}
              </Stack>

              {showClaimConditions && (
                <Box>
                  <Alert severity={'info'}>
                    <FormattedMessage
                      id="set.claim.conditions.to.enable.drop.info"
                      defaultMessage={
                        'Set claim conditions to enable the drop. You can edit anytime the claim conditions.'
                      }
                    />
                  </Alert>
                </Box>
              )}
              {showClaimConditions && (
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="claim conditions tab"
                    >
                      <Tab
                        label={
                          <FormattedMessage
                            id="claim.conditions"
                            defaultMessage={'Claim conditions'}
                          />
                        }
                        value="1"
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <ClaimConditionsContainer
                      address={contractAddress}
                      network={network}
                      tokenId={
                        assetSelected?.protocol === 'ERC1155'
                          ? assetSelected?.id
                          : undefined
                      }
                    />
                  </TabPanel>
                </TabContext>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
      {asset === undefined && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Alert severity={'info'}>
              <FormattedMessage
                id="click.on.nft.to.manage.and.set.claim.conditions."
                defaultMessage={
                  'Click on NFTs to start manage and set claim conditons.'
                }
              />
            </Alert>
          </Grid>
          {filteredAssets?.map((asset, index) => (
            <Grid item xs={6} sm={2} key={index}>
              <BaseAssetCard
                asset={asset}
                onClickCardAction={(a) => setAsset(a)}
                showControls={false}
              />
            </Grid>
          ))}
          {filteredAssets?.length === 0 && (
            <Grid item xs={12} sm={12}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h6">
                  <FormattedMessage
                    id="nfts.not.found"
                    defaultMessage="NFT's not found"
                  />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <FormattedMessage
                    id="clear.filters"
                    defaultMessage="Clear filters to see nft's"
                  />
                </Typography>
              </Stack>
            </Grid>
          )}
          <Grid item xs={12} sm={12} container justifyContent={'flex-end'}>
            <Pagination
              page={page + 1}
              onChange={(_ev, _page) => setPage(_page - 1)}
              count={Math.floor((data?.total || 0) / perPage) + 1}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
