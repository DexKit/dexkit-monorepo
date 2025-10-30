import { ChainId } from "@dexkit/core/constants";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { getChainIdFromSlug } from "@dexkit/core/utils/blockchain";
import { Box, CardMedia, Skeleton } from "@mui/material";
import { useNFTMediaType } from "../hooks";
import { AssetMetadata } from "../types";

interface Props {
  metadata?: AssetMetadata;
  chainId?: ChainId;
  network?: string;
  contractAddress?: string;
  tokenId?: string;
  aspectRatio?: string;
  height?: number | string;
  sx?: any;
  enableControls?: boolean;
  priority?: boolean;
}

export function NFTCardMedia({
  metadata,
  chainId,
  network,
  contractAddress = "",
  tokenId = "",
  aspectRatio = "1/1",
  height,
  sx,
  enableControls = false,
  priority = false,
}: Props) {
  const resolvedChainId = chainId || (network ? getChainIdFromSlug(network)?.chainId : ChainId.Ethereum);

  const mediaType = useNFTMediaType(
    contractAddress,
    resolvedChainId,
    tokenId,
    metadata
  );

  if (!metadata?.image && !metadata?.animation_url) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          aspectRatio,
          height: height || "100%",
          width: "100%",
          ...sx,
        }}
      />
    );
  }

  const containerSx = {
    aspectRatio,
    height: height || "100%",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    ...sx,
  };

  if (mediaType.isDetecting) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          aspectRatio,
          height: height || "100%",
          width: "100%",
          ...sx,
        }}
      />
    );
  }

  if (mediaType.type === "mp4" && mediaType.src) {
    return (
      <Box sx={containerSx}>
        <CardMedia
          component="div"
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <Box
            component="video"
            src={ipfsUriToUrl(mediaType.src)}
            poster={metadata?.image ? ipfsUriToUrl(metadata.image) : undefined}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "background.default",
            }}
            autoPlay
            muted
            loop
            playsInline
            controls={enableControls}
          />
        </CardMedia>
      </Box>
    );
  }

  if (mediaType.type === "audio" && mediaType.src) {
    return (
      <Box sx={containerSx}>
        <CardMedia
          component="div"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        >
          <Box
            component="audio"
            src={ipfsUriToUrl(mediaType.src)}
            controls={enableControls}
            style={{
              width: "90%",
              maxWidth: "300px",
            }}
          />
          {metadata?.image && (
            <Box
              component="img"
              src={ipfsUriToUrl(metadata.image)}
              alt=""
              loading="lazy"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.3,
                zIndex: 0,
              }}
            />
          )}
        </CardMedia>
      </Box>
    );
  }

  const imageUrl = metadata?.image ? ipfsUriToUrl(metadata.image) : "";
  return (
    <Box
      sx={{
        aspectRatio,
        height: height || "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "background.default",
        ...sx,
      }}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={metadata?.name || "NFT Image"}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </Box>
  );
}

