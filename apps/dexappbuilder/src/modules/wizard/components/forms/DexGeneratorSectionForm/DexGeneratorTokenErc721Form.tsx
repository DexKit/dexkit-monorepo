import { CollectionPageSection } from '@dexkit/ui/modules/wizard/types/section';
import ThirdwebV4Provider from '@dexkit/ui/providers/ThirdwebV4Provider';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

export interface DexGeneratorTokenErc721FormProps {
  onChange: (section: CollectionPageSection) => void;
  params: { network: string; address: string };
  section?: CollectionPageSection;
}

type FormType = {
  hideFilters: boolean;
  hideHeader: boolean;
  hideDrops: boolean;
  hideAssets: boolean;
};

function DexGeneratorTokenErc721Form({
  onChange,
  params,
  section,
}: DexGeneratorTokenErc721FormProps) {
  const { network, address } = params;

  const handleSubmit = ({}: FormType) => {};

  const handleValidate = (form: FormType) => {
    if (section) {
      onChange({
        type: 'collection',
        config: {
          ...section.config,
          ...form,
        },
      });
    }
  };

  return (
    <Formik
      initialValues={
        section && section.type === 'collection'
          ? section.config
          : {
              hideAssets: false,
              hideDrops: false,
              hideFilters: false,
              hideHeader: false,
              address: params.address,
              network: params.network,
            }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setFieldValue, values }: any) => (
        <Grid container spacing={2}>
          <Grid size={12}>
            <Grid container spacing={2}>
              <Grid>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.hideAssets}
                      onChange={(e: any) =>
                        setFieldValue('hideAssets', e.target.checked)
                      }
                    />
                  }
                  label={
                    <FormattedMessage
                      id="hide.assets"
                      defaultMessage="Hide Assets"
                    />
                  }
                />
              </Grid>
              <Grid>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.hideFilters}
                      onChange={(e: any) =>
                        setFieldValue('hideFilters', e.target.checked)
                      }
                    />
                  }
                  label={
                    <FormattedMessage
                      id="hide.filters"
                      defaultMessage="Hide Filters"
                    />
                  }
                />
              </Grid>
              <Grid>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.hideHeader}
                      onChange={(e: any) =>
                        setFieldValue('hideHeader', e.target.checked)
                      }
                    />
                  }
                  label={
                    <FormattedMessage
                      id="hide.header"
                      defaultMessage="Hide Header"
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}

export default function Wrapper(props: DexGeneratorTokenErc721FormProps) {
  const { chainId } = useWeb3React();

  return (
    <ThirdwebV4Provider chainId={chainId}>
      <DexGeneratorTokenErc721Form {...props} />
    </ThirdwebV4Provider>
  );
}
