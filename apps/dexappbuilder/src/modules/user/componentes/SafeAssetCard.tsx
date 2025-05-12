import { Asset } from "@dexkit/core/types/nft";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { Component, ErrorInfo, ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

class AssetErrorBoundary extends Component<{
  children: ReactNode;
  fallback?: ReactNode;
}> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error rendering NFT card:", error, errorInfo);
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

function SimpleNftCard({ asset }: { asset: Asset }) {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = asset.metadata?.image 
    ? ipfsUriToUrl(asset.metadata.image)
    : '';
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "100%",
          overflow: "hidden"
        }}
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={asset.metadata?.name || 'NFT Image'}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
            onError={handleImageError}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {imageError ? "Error loading image" : "No image available"}
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="subtitle1" component="div" noWrap>
          {asset.metadata?.name || 'Unnamed NFT'}
        </Typography>
        {asset.collectionName && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {asset.collectionName}
          </Typography>
        )}
        {asset.chainId && (
          <Chip 
            label={`Chain ID: ${asset.chainId}`} 
            size="small" 
            sx={{ mt: 1 }} 
          />
        )}
      </CardContent>
    </Card>
  );
}

interface SafeAssetCardProps {
  asset: Asset;
  showControls?: boolean;
  onHide?: (asset: Asset) => void;
  isHidden?: boolean;
  onTransfer?: (asset: Asset) => void;
}

export function SafeAssetCard(props: SafeAssetCardProps) {
  const { asset } = props;
  
  if (!asset) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="invalid.nft" defaultMessage="Invalid NFT data" />
        </Typography>
      </Box>
    );
  }

  return <SimpleNftCard asset={asset} />;
} 