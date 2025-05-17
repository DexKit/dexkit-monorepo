import { Asset } from "@dexkit/core/types/nft";
import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { Component, ErrorInfo, ReactNode, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SafeAssetCard } from "./SafeAssetCard";

class NftErrorBoundary extends Component<{
  children: ReactNode;
  fallback?: ReactNode;
}> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error rendering NFT:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            <FormattedMessage id="error.loading.nft" defaultMessage="Error loading NFT" />
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

interface NftSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (nft: Asset) => void;
  selectedNft?: Asset;
}

export function NftSelector({ open, onClose, onSelect, selectedNft }: NftSelectorProps) {
  const { account, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchNfts = async () => {
    if (!account || !chainId) return;

    setLoading(true);
    setError(null);
    try {
      const networks = getNetworkSlugFromChainId(chainId);
      
      const response = await axios.get("/api/wallet/nft", {
        params: { 
          accounts: account,
          networks: networks
        }
      });

      if (response.data && response.data.length) {
        const assets = response.data
          .map((a: any) => a.assets)
          .flat()
          .filter((a: any) => a);
        
        if (assets.length > 0) {
          setNfts(assets);
        } else {
          setNfts([]);
        }
      } else {
        setNfts([]);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setError("Error loading NFTs. Please try again.");
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && account) {
      fetchNfts();
    }
  }, [open, account, chainId]);

  const filteredNfts = useMemo(() => {
    return nfts.filter((nft) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      const collectionNameMatch = nft.collectionName ? 
        nft.collectionName.toLowerCase().includes(searchLower) : false;
      
      const nameMatch = nft.metadata?.name ? 
        nft.metadata.name.toLowerCase().includes(searchLower) : false;
      
      const addressMatch = nft.contractAddress ? 
        nft.contractAddress.toLowerCase().includes(searchLower) : false;
      
      return collectionNameMatch || nameMatch || addressMatch;
    });
  }, [nfts, searchTerm]);

  const renderSafeNft = (nft: Asset, index: number) => {
    try {
      return (
        <Grid item xs={12} sm={6} md={4} key={`nft-${index}`}>
          <Box 
            sx={{
              cursor: "pointer",
              border: selectedNft?.id === nft.id && 
                    selectedNft?.contractAddress === nft.contractAddress ? 
                    '2px solid primary.main' : 'none',
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
            onClick={() => onSelect(nft)}
          >
            <SafeAssetCard
              asset={nft}
              showControls={false}
            />
          </Box>
        </Grid>
      );
    } catch (err) {
      console.error("Error rendering NFT:", err);
      return null;
    }
  };

  const handleRetry = () => {
    fetchNfts();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            <FormattedMessage id="select.nft" defaultMessage="Select NFT" />
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
              <Button variant="outlined" onClick={handleRetry} sx={{ mt: 2 }}>
                <FormattedMessage id="retry" defaultMessage="Retry" />
              </Button>
            </Box>
          ) : nfts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="textSecondary">
                <FormattedMessage 
                  id="no.nfts.found" 
                  defaultMessage="No NFTs Found. Connect your wallet to view your NFTs." 
                />
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredNfts.map((nft, index) => renderSafeNft(nft, index))}
            </Grid>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
} 