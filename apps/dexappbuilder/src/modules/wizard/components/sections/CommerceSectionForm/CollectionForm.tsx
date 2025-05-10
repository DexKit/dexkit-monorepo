import { CommerceCollectionContent } from '@dexkit/ui/modules/wizard/types/section';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';

import { SiteContext } from '@dexkit/ui/providers/SiteProvider';
import { useContext } from 'react';

import CollectionsAutocomplete from '@dexkit/ui/modules/commerce/components/CollectionsAutocomplete';

import useCollectionsBySite from '@dexkit/ui/modules/commerce/hooks/useCollectionsBySite';

export default function CollectionForm() {
  const { setFieldValue, values } =
    useFormikContext<CommerceCollectionContent>();
  const { siteId } = useContext(SiteContext);

  const { data: items } = useCollectionsBySite({
    page: 0,
    limit: 20,
    siteId: siteId ?? 0,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CollectionsAutocomplete
          onChange={(value) => {
            setFieldValue('id', value ?? '');
          }}
          items={items?.items ?? []}
          value={values.id === '' ? null : values.id}
        />
      </Grid>
    </Grid>
  );
}
