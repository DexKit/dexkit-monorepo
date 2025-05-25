import { useCollection } from '@dexkit/ui/modules/nft/hooks/collection';
import { Chip, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  address?: string;
  chainId?: number;
}

export function ChipFilterTraits({ address, chainId }: Props) {
  const router = useRouter();
  const { data: collection } = useCollection(address as string, chainId);
  const [filterTraits, setFilterTraits] = useState<
    Array<{ property: string; value: string }>
  >([]);

  const queryFilterTraits = router.query?.traitsFilter as string;
  useEffect(() => {
    if (queryFilterTraits && collection?.traitCounts) {
      const properties = queryFilterTraits.split(',');
      setFilterTraits(
        properties.map((p) => {
          return { property: p.split('.')[0], value: p.split('.')[1] };
        }),
      );
    }
    if (!queryFilterTraits) {
      setFilterTraits([]);
    }
  }, [queryFilterTraits]);

  if (!collection?.traitCounts) {
    return null;
  }

  const handleDelete = (index: number) => {
    const newTraits = [...filterTraits];
    newTraits.splice(index, 1);
    router.replace({
      query: {
        ...router.query,
        traitsFilter: newTraits
          .map((f) => `${f.property}.${f.value}`)
          .join(','),
      },
    });
  };

  const handleDeleteAll = () => {
    router.replace({
      query: {
        ...router.query,
        traitsFilter: '',
      },
    });
  };

  return (
    <Stack spacing={2} sx={{ pt: 2 }} direction={'row'}>
      {filterTraits.map((p, i) => (
        <Chip
          key={i}
          label={`${p.property}: ${p.value}`}
          onDelete={() => handleDelete(i)}
        />
      ))}
      {filterTraits.length > 1 && (
        <Chip
          variant="outlined"
          label={
            <FormattedMessage id={'clear.all'} defaultMessage={'Clear all'} />
          }
          onDelete={() => handleDeleteAll()}
        />
      )}
    </Stack>
  );
}
