import { TokenErc20PageSection } from '@dexkit/ui/modules/wizard/types/section';
import ThirdwebV4Provider from '@dexkit/ui/providers/ThirdwebV4Provider';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

export interface DexGeneratorTokenErc20FormProps {
  onChange: (section: TokenErc20PageSection) => void;
  params: { network: string; address: string };
  section?: TokenErc20PageSection;
}

type FormType = {
  disableTransfer?: boolean;
  disableBurn?: boolean;
  disableMint?: boolean;
  disableInfo?: boolean;
};

function DexGeneratorTokenErc20Form({
  onChange,
  params,
  section,
}: DexGeneratorTokenErc20FormProps) {
  const { network, address } = params;

  const handleSubmit = ({}: FormType) => {};

  const handleValidate = (form: FormType) => {
    if (section) {
      onChange({
        type: 'token',
        settings: {
          ...section.settings,
          ...form,
        },
      });
    }
  };

  return (
    <Formik
      initialValues={
        section && section.type === 'token'
          ? section.settings
          : {
              disableBurn: false,
              disableInfo: false,
              disableMint: false,
              disableTransfer: false,
            }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setFieldValue, values }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values?.disableBurn}
                      onChange={(e) =>
                        setFieldValue('disableBurn', e.target.checked)
                      }
                    />
                  }
                  label={
                    <FormattedMessage
                      id="disable.burn"
                      defaultMessage="Disable Burn"
                    />
                  }
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.disableInfo}
                      onChange={(e) =>
                        setFieldValue('disableInfo', e.target.checked)
                      }
                    />
                  }
                  label={
                    <FormattedMessage
                      id="disable.info"
                      defaultMessage="Disable Info"
                    />
                  }
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.disableTransfer}
                      onChange={(e) =>
                        setFieldValue('disableTransfer', e.target.checked)
                      }
                    />
                  }
                  label={
                    <FormattedMessage
                      id="disable.transfer"
                      defaultMessage="Disable Transfer"
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

export default function Wrapper(props: DexGeneratorTokenErc20FormProps) {
  const { chainId } = useWeb3React();

  return (
    <ThirdwebV4Provider chainId={chainId}>
      <DexGeneratorTokenErc20Form {...props} />
    </ThirdwebV4Provider>
  );
}
