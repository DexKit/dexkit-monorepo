import DecimalInput from '@dexkit/web3forms/components/DecimalInput';
import { useIntl } from 'react-intl';

export interface Props {
  name: string;
}

export default function ContractFormPayableValueInput({ name }: Props) {
  const { formatMessage } = useIntl();

  return (
    <DecimalInput
      name={name}
      decimals={18}
      label={formatMessage({ id: 'amount', defaultMessage: 'Amount' })}
      helperText={formatMessage({
        id: 'default.amount.to.send.to.the.contract',
        defaultMessage: 'Default amount to send to the contract',
      })}
    />
  );
}
