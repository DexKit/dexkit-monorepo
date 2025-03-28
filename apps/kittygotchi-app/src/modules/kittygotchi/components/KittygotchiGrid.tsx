import KittygotchiCard from '@/modules/kittygotchi/components/KittygotchiCard';
import { useKittygotchiList } from '@/modules/kittygotchi/hooks';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useWeb3React } from '@web3-react/core';

export default function KittygotchiGrid() {
  const { account, chainId } = useWeb3React();

  const kittygotchiList = useKittygotchiList(account);

  return (
    <Box>
      <Grid container spacing={2}>
        {kittygotchiList.data?.map((kitty: any, index: number) => (
          <Grid item xs={6} sm={2} key={index}>
            <KittygotchiCard id={kitty.id} chainId={chainId} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
