import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useContractCollection } from '@dexkit/ui/modules/nft/hooks/collection';
import { FormattedMessage } from 'react-intl';

interface Props {
  networkId: string;
  address: string;
}

function ContractCollectionPageHeader({ networkId, address }: Props) {
  const { data: contract } = useContractCollection(networkId, address);

  const network = networkId;

  return (
    <PageHeader
      breadcrumbs={[
        {
          caption: <FormattedMessage id="home" defaultMessage="Home" />,
          uri: '/',
        },
        {
          caption: (
            <FormattedMessage id="collections" defaultMessage="Collections" />
          ),
          uri: '/contract-wizard',
        },
        {
          caption: contract?.collection?.name,
          uri: `/contract-wizard/collection/${network}/${address}`,
          active: true,
        },
      ]}
    />
  );
}

export default ContractCollectionPageHeader;
