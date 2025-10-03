// @ts-nocheck
import { Grid, Skeleton } from "@mui/material";
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
      <Grid item xs={12}>
        {asset ? (
          <AssetMedia asset={asset} enableImageLightbox={true} />
        ) : (
          <Skeleton />
        )}
      </Grid>
      <Grid item xs={12}>
        <AssetDetails address={address} id={id} />
      </Grid>
    </Grid>
  );
}

export default AssetLeftSection;
