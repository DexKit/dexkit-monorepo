import { getNetworkFromSlug } from '@dexkit/core/utils/blockchain';
import Link from '@dexkit/ui/components/AppLink';
import { useAccountContractCollection } from '@dexkit/ui/modules/nft/hooks/collection';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, MenuItem, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Wallet from 'src/components/icons/Wallet';

import { useConnectWalletDialog } from 'src/hooks/app';

import { truncateText } from 'src/utils/text';

interface Props {
  network: string;
  address: string;
}

function ContractMenu({ network, address }: Props) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        id="action-menu"
        edge="end"
        aria-label="view"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() =>
            router.push(`/contract-wizard/collection/${network}/${address}`)
          }
        >
          <FormattedMessage
            id={'view.collection'}
            defaultMessage={'View collection'}
          />
        </MenuItem>
        <MenuItem
          onClick={() =>
            router.push(
              `/contract-wizard/collection/${network}/${address}/create-nfts`,
            )
          }
        >
          <FormattedMessage id={'create.nft'} defaultMessage={'Create NFTs'} />
        </MenuItem>
      </Menu>
    </>
  );
}

export default function ContractCollectionList() {
  const { account, isActive } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();
  const contractCollections = useAccountContractCollection(account);
  const data = contractCollections?.data;
  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };

  return (
    <List sx={{ width: '100%' }}>
      {data &&
        data.map((contract) => (
          <>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <ContractMenu
                  network={contract.collection.networkId}
                  address={contract.collection.address}
                />
              }
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={
                    <Avatar
                      sx={{ width: 20, height: 20 }}
                      alt={
                        getNetworkFromSlug(contract.collection.networkId)?.name
                      }
                      src={
                        getNetworkFromSlug(contract.collection.networkId)
                          ?.imageUrl
                      }
                    />
                  }
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <Avatar
                    alt={contract.collection.name}
                    src={contract.collection.imageUrl}
                  />
                </Badge>{' '}
              </ListItemAvatar>

              <ListItemText
                primary={contract.collection.name}
                secondary={truncateText(contract.collection.description)}
              />
            </ListItem>
          </>
        ))}
      {data && data.length === 0 && (
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="h6">
            <FormattedMessage
              id="oops.nothing.here"
              defaultMessage="Oops! Nothing here"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              id="start.creating.collections"
              defaultMessage="Start creating collections"
            />
          </Typography>
          <Button
            LinkComponent={Link}
            href={`/contract-wizard/collection/create`}
            color="primary"
            variant="contained"
          >
            <FormattedMessage id="create" defaultMessage="Create" />
          </Button>
        </Stack>
      )}
      {!isActive && (
        <Stack justifyContent="center" alignItems="center" spacing={2}>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              id="connect.wallet.to.start.create.collections"
              defaultMessage="Connect wallet to start create collections"
            />
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleOpenConnectWalletDialog}
            startIcon={<Wallet />}
            endIcon={<ChevronRightIcon />}
          >
            <FormattedMessage
              id="connect.wallet"
              defaultMessage="Connect Wallet"
              description="Connect wallet button"
            />
          </Button>
        </Stack>
      )}
    </List>
  );
}
