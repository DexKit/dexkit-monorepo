import { copyToClipboard } from '@dexkit/core/utils';
import CopyIconButton from '@dexkit/ui/components/CopyIconButton';
import FileCopy from '@mui/icons-material/FileCopy';
import { useIntl } from 'react-intl';

interface Props {
  account: string;
}

export function CopyAddress({ account }: Props) {
  const handleCopy = () => {
    if (account) {
      copyToClipboard(account);
    }
  };

  const { formatMessage } = useIntl();

  return (
    <CopyIconButton
      iconButtonProps={{
        onClick: handleCopy,
        size: 'small',
      }}
      tooltip={formatMessage({
        id: 'copy.address',
        defaultMessage: 'Copy address',
        description: 'Copy text',
      })}
      activeTooltip={formatMessage({
        id: 'copied',
        defaultMessage: 'Copied!',
        description: 'Copied text',
      })}
    >
      <FileCopy fontSize="inherit" color="inherit" />
    </CopyIconButton>
  );
}
