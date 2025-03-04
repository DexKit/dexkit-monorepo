import { TransferUserEvent } from '@/modules/wizard/types/events';
import {
  getBlockExplorerUrl,
  getChainName,
  truncateAddress,
  truncateHash,
} from '@dexkit/core/utils';
import { UserEvent } from '@dexkit/ui/hooks/userEvents';
import { Link, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface TranserDetailProps {
  event: UserEvent<TransferUserEvent>;
}

export default function TransferDetail({ event }: TranserDetailProps) {
  const { to, token, amount } = event.processedMetadata;

  return (
    <Stack spacing={1}>
      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Typography>
          <FormattedMessage
            id="transaction.ash"
            defaultMessage="Transaction Hash"
          />
        </Typography>
        <Typography color="text.secondary">
          <Link
            href={
              event.chainId
                ? `${getBlockExplorerUrl(event.chainId)}/tx/${event.hash}`
                : undefined
            }
            target="_blank"
          >
            {event.hash ? truncateHash(event.hash) : null}
          </Link>
        </Typography>
      </Stack>
      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Typography>
          <FormattedMessage id="network" defaultMessage="Network" />
        </Typography>
        <Typography color="text.secondary">
          {event.chainId ? getChainName(event.chainId) : null}
        </Typography>
      </Stack>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Typography>
          <FormattedMessage id="amount" defaultMessage="Amount" />
        </Typography>
        <Typography color="text.secondary">
          {amount} {token.symbol.toUpperCase()}
        </Typography>
      </Stack>
      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Typography>
          <FormattedMessage id="from" defaultMessage="from" />
        </Typography>
        <Typography color="text.secondary">
          <Link
            href={
              event.chainId
                ? `${getBlockExplorerUrl(event.chainId)}/address/${event.from}`
                : undefined
            }
            target="_blank"
          >
            {event.from ? truncateAddress(event.from) : null}
          </Link>
        </Typography>
      </Stack>
      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Typography>
          <FormattedMessage id="to" defaultMessage="To" />
        </Typography>
        <Typography color="text.secondary">
          <Link
            href={
              event.chainId
                ? `${getBlockExplorerUrl(event.chainId)}/address/${to}`
                : undefined
            }
            target="_blank"
          >
            {truncateAddress(to)}
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
