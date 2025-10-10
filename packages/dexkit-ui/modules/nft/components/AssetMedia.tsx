import { Box, CardMedia, Paper, Skeleton } from "@mui/material";

import { Asset } from "@dexkit/core/types/nft";
import { useAssetMetadata } from "../hooks";
import { getNFTMediaSrcAndType } from "../utils";
import { AssetIframe } from "./AssetIframe";
import { AssetImage } from "./AssetImage";
import { AssetVideo } from "./AssetVideo";

interface Props {
  asset: Asset;
  enableImageLightbox?: boolean;
}

export function AssetMedia({ asset, enableImageLightbox }: Props) {
  const { data: metadata, isLoading } = useAssetMetadata(asset);

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
            paddingTop: { xs: "60%", sm: "100%" }, // Aspect ratio más pequeño en móviles
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

  const nftSrcAndType = getNFTMediaSrcAndType(
    asset.contractAddress,
    asset.chainId,
    asset.id,
    metadata
  );

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
          {nftSrcAndType.type === "image" && (
            <AssetImage
              src={metadata?.image}
              enableLightBox={enableImageLightbox}
            />
          )}
          {nftSrcAndType.type === "iframe" && nftSrcAndType.src && (
            <AssetIframe src={nftSrcAndType.src} />
          )}
          {nftSrcAndType.type === "mp4" && metadata?.animation_url && (
            <AssetVideo src={metadata?.animation_url} />
          )}
        </Box>
      </CardMedia>
    </Paper>
  );
}
