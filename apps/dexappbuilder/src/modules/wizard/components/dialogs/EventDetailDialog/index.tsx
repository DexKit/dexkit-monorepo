import { ChainId } from '@dexkit/core';
import { NETWORK_EXPLORER } from '@dexkit/core/constants/networks';
import { UserOnChainEvents } from '@dexkit/core/constants/userEvents';
import { truncateAddress } from '@dexkit/core/utils';
import { AppDialogTitle } from '@dexkit/ui';
import Link from '@dexkit/ui/components/AppLink';
import { UserEvent } from '@dexkit/ui/hooks/userEvents';
import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import EventDetails from './EventDetails';
import SwapDetail from './SwapDetail';
import TransferDetail from './TransferDetail';

export interface EventDetailDialogProps {
  DialogProps: DialogProps;
  event?: UserEvent;
}

export default function EventDetailDialog({
  DialogProps,
  event,
}: EventDetailDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const data = event?.processedMetadata;

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="event.details" defaultMessage="Event Details" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        {event?.type === UserOnChainEvents.swap && <SwapDetail event={event} />}
        {event?.type === UserOnChainEvents.transfer && (
          <TransferDetail event={event} />
        )}
        {event?.type === UserOnChainEvents.nftAcceptOfferERC721 && (
          <EventDetails
            items={[
              {
                label: (
                  <FormattedMessage
                    id="paid.amount"
                    defaultMessage="Paid amount"
                  />
                ),
                value: (
                  <Typography>
                    {data?.tokenAmount} {data?.token?.symbol?.toUpperCase()}
                  </Typography>
                ),
              },
              {
                label: (
                  <FormattedMessage
                    id="collection.name"
                    defaultMessage="Collection Name"
                  />
                ),
                value: <Typography>{data?.collection?.name}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="token.id" defaultMessage="Token ID" />
                ),
                value: <Typography>{data?.collection?.tokenId}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="Quantity" defaultMessage="Quantity" />
                ),
                value: <Typography>{data?.nftAmount}</Typography>,
              },
            ]}
          />
        )}

        {event?.type === UserOnChainEvents.nftAcceptListERC721 && (
          <EventDetails
            items={[
              {
                label: (
                  <FormattedMessage
                    id="paid.amount"
                    defaultMessage="Paid amount"
                  />
                ),
                value: (
                  <Typography>
                    {data?.tokenAmount} {data?.token?.symbol?.toUpperCase()}
                  </Typography>
                ),
              },
              {
                label: (
                  <FormattedMessage
                    id="collection.name"
                    defaultMessage="Collection Name"
                  />
                ),
                value: <Typography>{data?.collection?.name}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="token.id" defaultMessage="Token ID" />
                ),
                value: <Typography>{data?.collection?.tokenId}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="Quantity" defaultMessage="Quantity" />
                ),
                value: <Typography>{data?.nftAmount}</Typography>,
              },
            ]}
          />
        )}

        {event?.type === UserOnChainEvents.deployContract && (
          <EventDetails
            items={[
              {
                label: <FormattedMessage id="type" defaultMessage="Type" />,
                value: <Typography>{data?.type}</Typography>,
              },
              {
                label: <FormattedMessage id="name" defaultMessage="Name" />,
                value: <Typography>{data?.name}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="address" defaultMessage="Address" />
                ),
                value: (
                  <Link
                    target="_blank"
                    href={`${NETWORK_EXPLORER(
                      event?.chainId as ChainId,
                    )}/address/${data?.address}`}
                  >
                    {truncateAddress(data?.address)}
                  </Link>
                ),
              },
            ]}
          />
        )}

        {event?.type === UserOnChainEvents.nftAcceptListERC1155 && (
          <EventDetails
            items={[
              {
                label: (
                  <FormattedMessage
                    id="paid.amount"
                    defaultMessage="Paid amount"
                  />
                ),
                value: (
                  <Typography>
                    {data?.tokenAmount} {data?.token?.symbol?.toUpperCase()}
                  </Typography>
                ),
              },
              {
                label: (
                  <FormattedMessage
                    id="collection.name"
                    defaultMessage="Collection Name"
                  />
                ),
                value: <Typography>{data?.collection?.name}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="token.id" defaultMessage="Token ID" />
                ),
                value: <Typography>{data?.collection?.tokenId}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="Quantity" defaultMessage="Quantity" />
                ),
                value: <Typography>{data?.nftAmount}</Typography>,
              },
            ]}
          />
        )}

        {event?.type === UserOnChainEvents.nftAcceptOfferERC1155 && (
          <EventDetails
            items={[
              {
                label: (
                  <FormattedMessage
                    id="paid.amount"
                    defaultMessage="Paid amount"
                  />
                ),
                value: (
                  <Typography>
                    {data?.tokenAmount} {data?.token?.symbol?.toUpperCase()}
                  </Typography>
                ),
              },
              {
                label: (
                  <FormattedMessage
                    id="collection.name"
                    defaultMessage="Collection Name"
                  />
                ),
                value: <Typography>{data?.collection?.name}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="token.id" defaultMessage="Token ID" />
                ),
                value: <Typography>{data?.collection?.tokenId}</Typography>,
              },
              {
                label: (
                  <FormattedMessage id="Quantity" defaultMessage="Quantity" />
                ),
                value: <Typography>{data?.nftAmount}</Typography>,
              },
            ]}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
