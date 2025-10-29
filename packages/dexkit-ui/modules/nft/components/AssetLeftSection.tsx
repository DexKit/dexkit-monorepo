import { Box, Grid, Skeleton } from "@mui/material";
import { useAsset } from "../hooks";
import { AssetDetails } from "./AssetDetails";
import { AssetMedia } from "./AssetMedia";

export function AssetLeftSection({
  address,
  id,
}: {
  address: string;
  id: string;
}) {
  const { data: asset } = useAsset(address, id);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        {asset ? (
          <AssetMedia asset={asset} enableImageLightbox={true} showVideoControls={true} />
        ) : (
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
        )}
      </Grid>
      <Grid size={12}>
        <AssetDetails address={address} id={id} />
      </Grid>
    </Grid>
  );
}

export default AssetLeftSection;

