import { AssetDetails } from '@dexkit/ui/modules/nft/components/AssetDetails';
import { AssetMedia } from '@dexkit/ui/modules/nft/components/AssetMedia';
import { useAsset } from '@dexkit/ui/modules/nft/hooks';
import { Grid, Skeleton } from '@mui/material';

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
      <Grid item xs={12}>
        {asset ? <AssetMedia asset={asset} /> : <Skeleton />}
      </Grid>
      <Grid item xs={12}>
        <AssetDetails address={address} id={id} />
      </Grid>
    </Grid>
  );
}

export default OrderLeftSection;
