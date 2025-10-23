import { Grid, NoSsr } from '@mui/material';
import { AssetPageActions } from './AssetPageActions';
import { AssetPageTitle } from './AssetPageTitle';
import { AssetPricePaper } from './AssetPricePaper';
import { AssetTabs } from './AssetTabs';

interface Props {
  address: string;
  id: string;
}

export function AssetRightSection({ address, id }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <AssetPageTitle address={address} id={id} />
      </Grid>
      <Grid size={12}>
        <NoSsr>
          <AssetPageActions address={address} id={id} />
        </NoSsr>
      </Grid>
      <Grid size={12}>
        <AssetPricePaper address={address} id={id} />
      </Grid>
      <Grid size={12}>
        <AssetTabs address={address} id={id} />
      </Grid>
    </Grid>
  );
}

export default AssetRightSection;
