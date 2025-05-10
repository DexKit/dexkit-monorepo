import { WEB3FORMS_INPUT_TYPES } from '@dexkit/web3forms/constants';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ContractFormInputTypeTextProps {
  inputType: string;
}

export default function ContractFormInputTypeText({
  inputType,
}: ContractFormInputTypeTextProps) {
  const message = useMemo(() => {
    return WEB3FORMS_INPUT_TYPES[inputType];
  }, []);

  return (
    <Typography variant="body1" color="text.secondary">
      <FormattedMessage
        id={message.helpDefaultMessage}
        defaultMessage={message.helpDefaultMessage}
      />
    </Typography>
  );
}
