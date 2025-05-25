import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import { IconButton, TableCell, TableRow } from '@mui/material';

import useFetchTokenData from '@dexkit/ui/hooks/useFetchTokenData';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useField } from 'formik';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import ProductNetworkAutocomplete from './ProductNetworkAutocomplete';
import ProductTokenAutocomplete from './ProductTokenAutocomplete';

export interface ProductPriceTableRowProps {
  namePrefix: string;
  onRemove: () => void;
}

export default function ProductPriceTableRow({
  namePrefix,
  onRemove,
}: ProductPriceTableRowProps) {
  const [propsField, metaField, helpersField] = useField<any>(`${namePrefix}`);

  const {
    data: token,
    mutate: fetchData,
    isLoading,
  } = useFetchTokenData({ chainId: propsField.value.chainId });

  useEffect(() => {
    fetchData({
      contractAddress: propsField.value.contractAddress,
    });
  }, [propsField.value.contractAddress]);

  return (
    <TableRow>
      <TableCell>
        <ProductNetworkAutocomplete name={`${namePrefix}.chainId`} />
      </TableCell>
      <TableCell>
        <ProductTokenAutocomplete
          prefix={namePrefix}
          name={`${namePrefix}.contractAddress`}
        />
      </TableCell>
      <TableCell>
        <FormikDecimalInput
          name={`${namePrefix}.amount`}
          TextFieldProps={{
            fullWidth: true,
            size: 'small',
            label: <FormattedMessage id="amount" defaultMessage="Amount" />,
            disabled: isLoading,
          }}
          decimals={(token as any)?.decimals ?? 18}
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={onRemove}>
          <DeleteIcon color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
