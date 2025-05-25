import { FeatureSum } from '@dexkit/ui/types/ai';
import Info from '@mui/icons-material/Info';
import { Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { FormattedNumber } from 'react-intl';
import { FEAT_DESCRIPTIONS } from '../constants';
import { useFeatQuery } from '../hooks/payments';

export interface FeatUsageSummaryRowProps {
  feat: FeatureSum;
}

export default function FeatUsageSummaryRow({
  feat,
}: FeatUsageSummaryRowProps) {
  const featQuery = useFeatQuery({ id: feat.featId });
  return (
    <TableRow>
      <TableCell>{featQuery.data?.name}</TableCell>
      <TableCell>
        <Stack spacing={0.5} alignItems="center" direction="row">
          <span>
            <FormattedNumber
              style="currency"
              currency="USD"
              value={parseFloat(feat.amount)}
              currencyDisplay="narrowSymbol"
              minimumFractionDigits={4}
            />
          </span>
          <Tooltip
            title={
              featQuery.data?.slug
                ? FEAT_DESCRIPTIONS[featQuery.data?.slug]
                : undefined
            }
          >
            <Info fontSize="inherit" color="disabled" />
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
