import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import NFTGrid from '@dexkit/dexappbuilder-viewer/components/NFTGrid';
import { EditionDropPageSection } from '@dexkit/ui/modules/wizard/types/section';
import ThirdwebV4Provider from '@dexkit/ui/providers/ThirdwebV4Provider';
import { Grid } from '@mui/material';
import { useContract, useNFTs } from '@thirdweb-dev/react';
import { Formik } from 'formik';

export interface DexGeneratorEditionDropFormProps {
  onChange: (section: EditionDropPageSection) => void;
  params: { network: string; address: string };
  section?: EditionDropPageSection;
}

function DexGeneratorEditionDropForm({
  onChange,
  params,
  section,
}: DexGeneratorEditionDropFormProps) {
  const { network, address } = params;

  const handleSubmit = ({ tokenId }: { tokenId?: string }) => {};

  const handleValidate = ({ tokenId }: { tokenId?: string }) => {
    onChange({
      type: 'edition-drop-section',
      config: { network, address, tokenId: tokenId || '' },
    });
  };

  const { data: contract } = useContract(address);
  const nftsQuery = useNFTs(contract);

  return (
    <Formik
      initialValues={
        section && section.type === 'edition-drop-section'
          ? { tokenId: section.config.tokenId }
          : {}
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setFieldValue, values }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {nftsQuery.data ? (
              <NFTGrid
                nfts={nftsQuery.data}
                network={network}
                address={address}
                selectedTokenId={values.tokenId}
                onClick={(tokenId: string) => {
                  if (tokenId === values.tokenId) {
                    return setFieldValue('tokenId', undefined);
                  }
                  setFieldValue('tokenId', tokenId);
                }}
              />
            ) : null}
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}

export default function Wrapper(props: DexGeneratorEditionDropFormProps) {
  const { section } = props;

  return (
    <ThirdwebV4Provider
      chainId={NETWORK_FROM_SLUG(section?.config.network)?.chainId}
    >
      <DexGeneratorEditionDropForm {...props} />
    </ThirdwebV4Provider>
  );
}
