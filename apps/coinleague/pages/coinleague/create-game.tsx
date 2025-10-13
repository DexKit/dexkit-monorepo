import type { NextPage } from 'next';

import TickerTapeTV from '@/modules/coinleague/components/TickerTapeTV';
import { GameGraph } from '@/modules/coinleague/types';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import AppShareDialog from '@/modules/common/components/dialogs/AppShareDialog';
import GameController from '@/modules/common/components/icons/GameController';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Avatar,
  Box,
  ButtonBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const CreateGameDialog = dynamic(
  () => import('@/modules/coinleague/components/dialogs/CreateGameDialog'),
);
const GameMetadataDialog = dynamic(
  () => import('@/modules/coinleague/components/dialogs/GameMetadataDialog'),
);

const CreateGame: NextPage = () => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const [selectedGame, setSelectedGame] = useState<GameGraph>();
  const [showMetadata, setShowMetadata] = useState(false);

  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
    setShareUrl(undefined);
  };

  const handleCloseMetadataDialog = () => {
    setSelectedGame(undefined);
    setShowMetadata(false);
  };

  const [showCreateGame, setShowCreateGame] = useState(false);

  const handleCloseCreateGame = () => {
    setShowCreateGame(false);
  };

  const handleOpenCreateGame = () => {
    setShowCreateGame(true);
  };

  return (
    <>
      <AppShareDialog
        dialogProps={{
          open: showShareDialog,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        url={shareUrl}
      />
      {showMetadata && (
        <GameMetadataDialog
          dialogProps={{
            open: showMetadata,
            onClose: handleCloseMetadataDialog,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          game={selectedGame}
        />
      )}
      {showCreateGame && (
        <CreateGameDialog
          dialogProps={{
            open: showCreateGame,
            onClose: handleCloseCreateGame,
            fullWidth: true,
            maxWidth: 'sm',
          }}
        />
      )}
      <MainLayout>
        <Stack spacing={2}>
          <TickerTapeTV />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <AppPageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="coin.league"
                      defaultMessage="Coin League"
                    />
                  ),
                  uri: '/',
                  active: true,
                },
              ]}
            />
          </Stack>

          <ButtonBase
            sx={{ width: '100%', display: 'block' }}
            onClick={handleOpenCreateGame}
          >
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Avatar
                    sx={(theme) => ({
                      backgroundColor: theme.palette.background.default,
                    })}
                  >
                    <GameController color="action" />
                  </Avatar>
                  <Box>
                    <Typography align="left" variant="body1">
                      <FormattedMessage
                        id="create.game"
                        defaultMessage="Create Game"
                      />
                    </Typography>
                    <Typography
                      align="left"
                      variant="body2"
                      color="textSecondary"
                    >
                      <FormattedMessage
                        id="coin.league"
                        defaultMessage="Coin League"
                      />
                    </Typography>
                  </Box>
                </Stack>
                <ChevronRightIcon />
              </Stack>
            </Paper>
          </ButtonBase>
        </Stack>
      </MainLayout>
    </>
  );
};

export default CreateGame;
