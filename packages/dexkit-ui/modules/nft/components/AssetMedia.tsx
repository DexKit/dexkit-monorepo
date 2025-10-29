import { Box, CardMedia, Paper, Skeleton } from "@mui/material";

import { Asset } from "@dexkit/core/types/nft";
import { useAssetMetadata, useNFTMediaType } from "../hooks";
import { AssetAudio } from "./AssetAudio";
import { AssetIframe } from "./AssetIframe";
import { AssetImage } from "./AssetImage";
import { AssetVideo } from "./AssetVideo";

interface Props {
  asset: Asset;
  enableImageLightbox?: boolean;
  showVideoControls?: boolean;
}

export function AssetMedia({ asset, enableImageLightbox, showVideoControls = false }: Props) {
  const { data: metadata, isLoading } = useAssetMetadata(asset);

  const nftSrcAndType = useNFTMediaType(
    asset.contractAddress,
    asset.chainId,
    asset.id,
    metadata
  );

  if (isLoading) {
    return (
      <Paper
        sx={{
          maxWidth: "100%",
          height: "100%",
          width: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            paddingTop: { xs: "75%", sm: "100%" },
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "inherit"
            }}
          />
        </Box>
      </Paper>
    );
  }

  if (nftSrcAndType.isDetecting) {
    return (
      <Paper
        sx={{
          maxWidth: "100%",
          height: "100%",
          width: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            paddingTop: { xs: "75%", sm: "100%" },
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "inherit"
            }}
          />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <CardMedia
        component="div"
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {nftSrcAndType.type === "image" && nftSrcAndType.src && (
            <AssetImage
              src={nftSrcAndType.src || metadata?.image}
              enableLightBox={enableImageLightbox}
            />
          )}
          {nftSrcAndType.type === "iframe" && nftSrcAndType.src && (
            <AssetIframe src={nftSrcAndType.src} />
          )}
          {nftSrcAndType.type === "mp4" && nftSrcAndType.src && (
            <AssetVideo
              src={nftSrcAndType.src}
              poster={metadata?.image}
              showControls={showVideoControls}
            />
          )}
          {!nftSrcAndType.src && metadata?.image && (
            <AssetImage
              src={metadata.image}
              enableLightBox={enableImageLightbox}
            />
          )}
          {nftSrcAndType.type === "audio" && nftSrcAndType.src && (
            <AssetAudio
              src={nftSrcAndType.src}
              poster={metadata?.image}
            />
          )}
        </Box>
      </CardMedia>
    </Paper>
  );
}
