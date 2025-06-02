import { NftDropPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { FormControl, Grid, InputLabel, MenuItem } from '@mui/material';
import { Field, Formik } from 'formik';
import { Select } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface DexGeneratorNFTDropFormProps {
  onChange: (section: NftDropPageSection) => void;
  params: { network: string; address: string };
  section?: NftDropPageSection;
}

export default function DexGeneratorNFTDropForm({
  onChange,
  params,
  section,
}: DexGeneratorNFTDropFormProps) {
  const { network, address } = params;

  const handleSubmit = ({ variant }: { variant?: 'simple' | 'detailed' }) => {};

  const handleValidate = ({ variant }: { variant?: 'simple' | 'detailed' }) => {
    onChange({ type: 'nft-drop', settings: { address, network, variant } });
  };

  return (
    <Formik
      initialValues={
        section && section.type === 'nft-drop'
          ? { variant: section.settings.variant }
          : { variant: 'simple' }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({}) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                <FormattedMessage id="variant" defaultMessage="Variant" />
              </InputLabel>
              <Field
                label={
                  <FormattedMessage id="variant" defaultMessage="Variant" />
                }
                component={Select}
                name="variant"
                fullWidth
              >
                <MenuItem value="simple">
                  <FormattedMessage id="simple" defaultMessage="Simple" />
                </MenuItem>
                <MenuItem value="detailed">
                  <FormattedMessage id="detailed" defaultMessage="Detailed" />
                </MenuItem>
              </Field>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
