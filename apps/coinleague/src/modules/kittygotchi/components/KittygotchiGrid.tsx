import KittygotchiCard from '@/modules/kittygotchi/components/KittygotchiCard';
import { useKittygotchiList } from '@/modules/kittygotchi/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';

export default function KittygotchiGrid() {
  const { account, chainId } = useWeb3React();

  const kittygotchiList = useKittygotchiList(account);

  return (
    <Box>
      <Grid container spacing={2}>
        {kittygotchiList.data?.map((kitty: any, index: number) => (
          <Grid size={{ xs: 6, sm: 2 }} key={index}>
            <KittygotchiCard id={kitty.id} chainId={chainId} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


