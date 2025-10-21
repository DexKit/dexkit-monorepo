import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import { AssetAPI } from '@dexkit/ui/modules/nft/types';
import { ExtendedAsset } from '@dexkit/ui/types/ai';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const getNetworkFromChainId = (chainId?: number | string): string => {
  if (!chainId) return 'unknown';

  const chainIdNum =
    typeof chainId === 'string' ? parseInt(chainId, 10) : chainId;

  switch (chainIdNum) {
    case 1:
      return 'ethereum';
    case 137:
      return 'polygon';
    case 42161:
      return 'arbitrum';
    case 8453:
      return 'base';
    case 10:
      return 'optimism';
    case 56:
      return 'bsc';
    case 97:
      return 'bsc';
    default:
      return getNetworkSlugFromChainId(chainIdNum) || 'unknown';
  }
};

const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;

  const invalidPatterns = [
    'data:text/html',
    'default.png',
    'placeholder',
    'no-image',
    'error.png',
    'undefined',
    'null',
    'unsupported',
    'missing',
  ];

  if (url.length < 8) return false;

  if (invalidPatterns.some((pattern) => url.toLowerCase().includes(pattern))) {
    return false;
  }

  if (url.startsWith('{') || url.includes('":"') || url.includes('","')) {
    return false;
  }

  const validExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.avif',
  ];
  const hasValidExtension = validExtensions.some((ext) =>
    url.toLowerCase().endsWith(ext),
  );

  const isValidProtocol =
    url.startsWith('http') ||
    url.startsWith('https') ||
    url.startsWith('ipfs://') ||
    url.startsWith('data:image/');

  return hasValidExtension || isValidProtocol;
};

const SUPPORTED_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'polygon', name: 'Polygon', color: '#8247E5' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#23A7E0' },
  { id: 'base', name: 'Base', color: '#0052FF' },
  { id: 'optimism', name: 'Optimism', color: '#FF0420' },
  { id: 'bsc', name: 'BNB Chain', color: '#F0B90B' },
];

const SORT_OPTIONS = [
  { id: 'name_asc', name: 'Name (A-Z)' },
  { id: 'name_desc', name: 'Name (Z-A)' },
  { id: 'network', name: 'Network' },
  { id: 'chainId', name: 'Chain ID' },
];

interface NftCardProps {
  nft: ExtendedAsset;
  isSelected: boolean;
  onClick: () => void;
}

function NftCard({ nft, isSelected, onClick }: NftCardProps) {
  const [imageError, setImageError] = useState(false);

  const getProcessedImageUrl = (url: string | undefined): string => {
    if (!url || !isValidImageUrl(url)) return '';

    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    if (url.startsWith('/') && !url.startsWith('//')) {
      let domain = 'ipfs.io';
      if (nft.tokenURI) {
        try {
          const urlParts = nft.tokenURI.split('/');
          if (urlParts.length > 2) {
            domain = urlParts[2];
          }
        } catch (e) {
          // Error processing image URL
        }
      }
      return `https://${domain}${url}`;
    }

    return url;
  };

  const imageUrl = getProcessedImageUrl(
    nft.imageUrl || nft.metadata?.image || '',
  );

  const network = nft.networkId || getNetworkFromChainId(nft.chainId);

  const networkInfo = SUPPORTED_NETWORKS.find((net) => net.id === network);

  const handleError = () => {
    setImageError(true);
  };

  const tryAlternativeImage = () => {
    if (
      nft.metadata?.image &&
      nft.imageUrl &&
      nft.metadata.image !== nft.imageUrl
    ) {
      return getProcessedImageUrl(nft.metadata.image);
    }

    if (nft.metadata?.attributes) {
      const imageAttr = nft.metadata.attributes.find(
        (attr: any) => attr.trait_type?.toLowerCase() === 'image',
      );

      if (imageAttr?.value && typeof imageAttr.value === 'string') {
        return getProcessedImageUrl(imageAttr.value);
      }
    }

    return '';
  };

  const alternativeImageUrl = tryAlternativeImage();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        height: '100%',
        border: isSelected ? '2px solid #3f51b5' : 'none',
        boxShadow: isSelected ? '0 0 10px rgba(63, 81, 181, 0.5)' : undefined,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={nft.metadata?.name || 'NFT Image'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onError={handleError}
            loading="lazy"
          />
        ) : alternativeImageUrl ? (
          <img
            src={alternativeImageUrl}
            alt={nft.metadata?.name || 'NFT Image'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              px={2}
            >
              {imageError ? 'Error loading image' : 'No image available'}
            </Typography>
          </Box>
        )}
        {networkInfo && (
          <Tooltip title={networkInfo.name}>
            <Chip
              label={networkInfo.name.charAt(0)}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: networkInfo.color,
                color: 'white',
                fontWeight: 'bold',
                minWidth: '24px',
                height: '24px',
              }}
            />
          </Tooltip>
        )}
      </Box>
      <CardContent>
        <Typography
          variant="subtitle1"
          component="div"
          noWrap
          fontWeight="bold"
        >
          {nft.metadata?.name || nft.name || 'Unnamed NFT'}
        </Typography>
        {nft.collectionName && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {nft.collectionName}
          </Typography>
        )}
        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          {network && (
            <Chip
              label={
                networkInfo?.name ||
                network.charAt(0).toUpperCase() + network.slice(1)
              }
              size="small"
              sx={{
                bgcolor: networkInfo?.color || 'primary.main',
                color: 'white',
                fontSize: '0.7rem',
                height: '20px',
              }}
            />
          )}
          {nft.chainId && (
            <Chip
              label={`ID: ${nft.chainId}`}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: '20px',
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

interface DirectNftSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (nft: ExtendedAsset) => void;
  selectedNft?: ExtendedAsset;
}

export function DirectNftSelector({
  open,
  onClose,
  onSelect,
  selectedNft,
}: DirectNftSelectorProps) {
  const { account, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<ExtendedAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name_asc');

  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    if (open && account) {
      fetchNfts();
    }
  }, [open, account]);

  const fetchNfts = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      const networks = SUPPORTED_NETWORKS.map((net) => net.id).join(',');

      const response = await axios.get('/api/wallet/nft', {
        params: {
          accounts: account,
          networks: networks,
        },
      });

      if (response.data && response.data.length) {
        const assets = response.data
          .map((a: any) => a.assets)
          .flat()
          .filter((a: any) => a);

        if (assets.length > 0) {
          const processedAssets = assets.map((asset: AssetAPI) => {
            if (
              !asset.imageUrl &&
              asset.rawDataJSON?.image &&
              isValidImageUrl(asset.rawDataJSON?.image)
            ) {
              asset.imageUrl = asset.rawDataJSON?.image;
            }

            if (asset.imageUrl && asset.imageUrl.startsWith('ipfs://')) {
              asset.imageUrl = asset.imageUrl.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/',
              );
            }

            if (asset.chainId && !asset.networkId) {
              asset.networkId = getNetworkFromChainId(asset.chainId);
            }
            // We do here the transformation as asset id from db is different from token id, to make this compatible, I do this assign
            (asset as unknown as ExtendedAsset).dbId = asset.id;
            (asset as unknown as ExtendedAsset).id = asset.tokenId;

            return asset;
          });

          const networkCounts = processedAssets.reduce(
            (acc: Record<string, number>, asset: any) => {
              const network =
                asset.networkId ||
                (asset.chainId
                  ? getNetworkFromChainId(asset.chainId)
                  : 'unknown');
              if (network) {
                acc[network] = (acc[network] || 0) + 1;
              }
              return acc;
            },
            {},
          );

          setNfts(processedAssets);
        } else {
          setNfts([]);
        }
      } else {
        setNfts([]);
      }
    } catch (error) {
      setError('Error loading NFTs. Please try again.');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleNetwork = (networkId: string) => {
    setSelectedNetworks((prev: string[]) => {
      if (prev.includes(networkId)) {
        return prev.filter((id) => id !== networkId);
      } else {
        return [...prev, networkId];
      }
    });
  };

  const clearFilters = () => {
    setSelectedNetworks([]);
    setSearchTerm('');
    setSortBy('name_asc');
  };

  const filteredNfts = useMemo(() => {
    let result = [...nfts];

    if (selectedNetworks.length > 0) {
      result = result.filter((nft) => {
        const network = nft.networkId || getNetworkFromChainId(nft.chainId);
        return network ? selectedNetworks.includes(network) : false;
      });
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((nft) => {
        const collectionMatch = nft.collectionName
          ? nft.collectionName.toLowerCase().includes(searchLower)
          : false;

        const nameMatch =
          nft.metadata?.name || nft.name
            ? (nft.metadata?.name || nft.name || '')
                .toLowerCase()
                .includes(searchLower)
            : false;

        return collectionMatch || nameMatch;
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return (a.metadata?.name || a.name || '').localeCompare(
            b.metadata?.name || b.name || '',
          );
        case 'name_desc':
          return (b.metadata?.name || b.name || '').localeCompare(
            a.metadata?.name || a.name || '',
          );
        case 'network':
          const networkA = a.networkId || getNetworkFromChainId(a.chainId);
          const networkB = b.networkId || getNetworkFromChainId(b.chainId);
          return (networkA ?? 'unknown')
            .toString()
            .localeCompare((networkB ?? 'unknown').toString());
        case 'chainId':
          return (a.chainId || 0) - (b.chainId || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [nfts, selectedNetworks, searchTerm, sortBy]);

  const networkStats = useMemo(() => {
    return nfts.reduce((acc: Record<string, number>, nft: any) => {
      const network = nft.networkId || getNetworkFromChainId(nft.chainId);
      if (network) {
        acc[network] = (acc[network] || 0) + 1;
      }
      return acc;
    }, {});
  }, [nfts]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    const dialogContent = document.querySelector('.MuiDialogContent-root');
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
  };

  const totalPages = useMemo(() => {
    return Math.ceil(filteredNfts.length / itemsPerPage);
  }, [filteredNfts.length, itemsPerPage]);

  const paginatedNfts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredNfts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNfts, page, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [filteredNfts.length, searchTerm, selectedNetworks]);

  const handleRetry = () => {
    fetchNfts();
  };

  const isNftSelected = (nft: ExtendedAsset) => {
    if (!selectedNft) return false;
    return (
      nft.id === selectedNft.id &&
      nft.contractAddress === selectedNft.contractAddress &&
      nft.chainId === selectedNft.chainId
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh', maxHeight: '900px' },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            <FormattedMessage
              id="select.nft.for.profile"
              defaultMessage="Select NFT for Profile"
            />
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pb: 1, px: { xs: 1, sm: 2 } }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack spacing={2}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: 'background.paper',
                  pt: 1,
                  pb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  mb: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ sm: 'center' }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search by name or collection..."
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    size="small"
                  />

                  <Tooltip title="Sort Options">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        displayEmpty
                        startAdornment={
                          <SortIcon color="action" sx={{ mr: 1 }} />
                        }
                      >
                        {SORT_OPTIONS.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Tooltip>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mt: 2, mb: 1 }}
                  justifyContent="center"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mr: 1, alignSelf: 'center' }}
                  >
                    <FormattedMessage
                      id="networks"
                      defaultMessage="Networks:"
                    />
                  </Typography>

                  {SUPPORTED_NETWORKS.map((network) => (
                    <Chip
                      key={network.id}
                      label={`${network.name} (${
                        networkStats[network.id] || 0
                      })`}
                      onClick={() => toggleNetwork(network.id)}
                      color={
                        selectedNetworks.includes(network.id)
                          ? 'primary'
                          : 'default'
                      }
                      variant={
                        selectedNetworks.includes(network.id)
                          ? 'filled'
                          : 'outlined'
                      }
                      size="small"
                      sx={{
                        '& .MuiChip-label': {
                          fontWeight: selectedNetworks.includes(network.id)
                            ? 'bold'
                            : 'normal',
                        },
                        borderColor: network.color,
                        '&.MuiChip-outlined': {
                          borderColor: network.color,
                          color: network.color,
                        },
                      }}
                    />
                  ))}

                  {selectedNetworks.length > 0 && (
                    <Chip
                      label="Clear All"
                      onClick={clearFilters}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>

              <Box sx={{ pt: 2, pb: 1 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Stack alignItems="center" spacing={2}>
                      <CircularProgress />
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage
                          id="loading.nfts"
                          defaultMessage="Loading your NFTs..."
                        />
                      </Typography>
                    </Stack>
                  </Box>
                ) : error ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="error" gutterBottom>
                      {error}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleRetry}
                      sx={{ mt: 2 }}
                    >
                      <FormattedMessage id="retry" defaultMessage="Retry" />
                    </Button>
                  </Box>
                ) : filteredNfts.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      {nfts.length === 0 ? (
                        <FormattedMessage
                          id="no.nfts.found"
                          defaultMessage="No NFTs Found. Connect your wallet to view your NFTs."
                        />
                      ) : (
                        <FormattedMessage
                          id="no.nfts.matching.filters"
                          defaultMessage="No NFTs matching your filters. Try adjusting your search criteria."
                        />
                      )}
                    </Typography>
                    {nfts.length > 0 && (
                      <Button
                        variant="outlined"
                        onClick={clearFilters}
                        sx={{ mt: 2 }}
                      >
                        <FormattedMessage
                          id="clear.filters"
                          defaultMessage="Clear Filters"
                        />
                      </Button>
                    )}
                  </Box>
                ) : (
                  <>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage
                          id="showing.results"
                          defaultMessage="Showing {count} NFTs"
                          values={{ count: paginatedNfts.length }}
                        />
                        {filteredNfts.length !== nfts.length &&
                          ` (filtered from ${nfts.length})`}
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary">
                        <FormattedMessage
                          id="page.info"
                          defaultMessage="Page {page} of {total}"
                          values={{
                            page: page,
                            total: totalPages || 1,
                          }}
                        />
                      </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                      {paginatedNfts.map((nft: any, index: number) => (
                        <Grid
                          key={`nft-${index}`}
                          size={{
                            xs: 6,
                            sm: 4,
                            md: 3,
                            lg: 2
                          }}>
                          <NftCard
                            nft={nft}
                            isSelected={isNftSelected(nft)}
                            onClick={() => onSelect(nft)}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {totalPages > 1 && (
                      <Box
                        sx={{
                          mt: 3,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          showFirstButton
                          showLastButton
                          siblingCount={1}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}
      >
        {selectedNft && (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" mr={1}>
              <FormattedMessage id="selected" defaultMessage="Selected:" />
            </Typography>
            <Chip
              label={
                selectedNft.metadata?.name ||
                selectedNft.name ||
                selectedNft.collectionName ||
                'NFT'
              }
              color="primary"
              size="small"
            />
          </Box>
        )}
        <Button onClick={onClose} color="inherit">
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          disabled={!selectedNft}
        >
          <FormattedMessage id="select" defaultMessage="Select" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
