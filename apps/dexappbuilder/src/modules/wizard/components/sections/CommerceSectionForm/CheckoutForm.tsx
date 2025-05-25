import { CommerceCheckoutContent } from '@dexkit/ui/modules/wizard/types/section';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';

import CheckoutsAutocomplete from '@dexkit/ui/modules/commerce/components/CommerceSection/CheckoutsAutocomple';

import useCheckoutListBySite from '@dexkit/ui/modules/commerce/hooks/checkout/useCheckoutListBySite';
import { SiteContext } from '@dexkit/ui/providers/SiteProvider';
import { useContext } from 'react';

export default function CheckoutForm() {
  const { setFieldValue, values } = useFormikContext<CommerceCheckoutContent>();
  const { siteId } = useContext(SiteContext);

  const { data: items } = useCheckoutListBySite({
    page: 0,
    limit: 20,
    siteId: siteId ?? 0,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CheckoutsAutocomplete
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
