import { Grid, Skeleton } from "@mui/material";

import { AssetDetails } from "../../nft/components/AssetDetails";
import { AssetMedia } from "../../nft/components/AssetMedia";
import { useAsset } from "../../nft/hooks";

export function OrderLeftSection({
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
        {asset ? <AssetMedia asset={asset} /> : <Skeleton />}
      </Grid>
      <Grid size={12}>
        <AssetDetails address={address} id={id} />
      </Grid>
    </Grid>
  );
}

export default OrderLeftSection;
