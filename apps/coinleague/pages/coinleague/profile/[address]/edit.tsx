import ProfileImage from '@/modules/coinleague/components/ProfileImage';
import ProfileSelectImageDialog from '@/modules/coinleague/components/ProfileSelectImageDialog';
import {
  useCoinLeagueProfileChecker,
  useGameProfileUpdater,
  useProfileGame,
} from '@/modules/coinleague/hooks/profile';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import { useDebounce } from '@/modules/common/hooks/misc';
import { Edit, Info } from '@mui/icons-material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const ProfileEditPage: NextPage = () => {
  const router = useRouter();

  const { address } = router.query;

  const { formatMessage } = useIntl();

  const profileQuery = useProfileGame((address as string)?.toLowerCase());

  const [username, setUsername] = useState('');

  const [successMessage, setSuccessMessage] = useState<string>();

  const [selectedAsset, setSelectedAsset] = useState<{
    tokenId: string;
    contractAddress: string;
  }>();

  const lazyUsername = useDebounce<string>(username, 400);

  const profileChecker = useCoinLeagueProfileChecker(lazyUsername);

  const isUsernameInvalid = useCallback(() => {
    return (
      lazyUsername !== (profileQuery.data?.username || '') &&
      !profileChecker.data?.isAvailable
    );
  }, [profileChecker.data, lazyUsername, profileQuery.data]);

  const handleChangeUsername = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value !== '') {
        if (/^[a-z0-9]+$/.test(e.target.value)) {
          setUsername(e.target.value);
        }
      } else {
        setUsername('');
      }
    },
    []
  );

  const renderUsernameCheck = useCallback(() => {
    if (profileChecker.isLoading) {
      return <CircularProgress color="primary" size="1rem" />;
    }

    if (lazyUsername !== (profileQuery.data?.username || '')) {
      if (profileChecker.data?.isAvailable) {
        return (
          <CheckCircle
            sx={(theme) => ({ color: theme.palette.success.main })}
          />
        );
      } else {
        return <Info sx={(theme) => ({ color: theme.palette.error.main })} />;
      }
    }
  }, [profileChecker, lazyUsername, profileQuery.data]);

  const profileUpdater = useGameProfileUpdater();

  const handleSaveProfile = useCallback(() => {
    if (lazyUsername !== '') {
      const callbacks = {
        onConfirmation: () => {
          if (profileQuery.data) {
            setSuccessMessage(
              formatMessage({
                id: 'profile.update',
                defaultMessage: 'Profile updated',
              })
            );
          } else {
            setSuccessMessage(
              formatMessage({
                id: 'profile.created',
                defaultMessage: 'Profile created',
              })
            );
          }
        },
        onError: (err: Error) => {},
      };

      if (selectedAsset !== undefined) {
        profileUpdater.onPostMetadataMutation.mutate({
          username: lazyUsername,
          tokenAddress: selectedAsset.contractAddress,
          tokenId: selectedAsset.tokenId,
        });
      } else {
        profileUpdater.onPostOnlyUsernameMetadataMutation.mutate({
          username: lazyUsername,
        });
      }
    }
  }, [profileUpdater, lazyUsername, selectedAsset, profileQuery]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showSelectImage, setShowSelectImage] = useState(false);

  const handleCloseSelectImageDialog = () => {
    setShowSelectImage(false);
  };

  const handleOpenSelectImageDialog = () => {
    setShowSelectImage(true);
  };

  const handleSelectProfileImage = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
    image: string;
  }) => {
    setSelectedAsset({ contractAddress, tokenId });
  };

  return (
    <>
      {showSelectImage && (
        <ProfileSelectImageDialog
          dialogProps={{
            open: showSelectImage,
            onClose: handleCloseSelectImageDialog,
            fullWidth: true,
            maxWidth: 'lg',
            fullScreen: isMobile,
          }}
          onSelect={handleSelectProfileImage}
          address={address as string}
        />
      )}
      <MainLayout>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body1">
              <FormattedMessage
                id="picture.and.cover"
                defaultMessage="Picture and Cover"
              />
            </Typography>
            <Typography color="textSecondary" variant="body2">
              <FormattedMessage
                id="choose.one.nft.to.represent.your.profile"
                defaultMessage="Choose one NFT to represent your profile"
              />
            </Typography>
          </Box>
          <Box>
            <ProfileImage
              image={profileQuery.data?.profileImage}
              onClick={handleOpenSelectImageDialog}
            />
          </Box>
          <Box>
            <Typography variant="body1">
              <FormattedMessage
                id="account.information"
                defaultMessage="Account information"
              />
            </Typography>
            <Typography color="textSecondary" variant="body2">
              <FormattedMessage
                id="edit.your.public.profile.information"
                defaultMessage="Edit your public profile information"
              />
            </Typography>
          </Box>
          <Box>
            <TextField
              placeholder={formatMessage({
                id: 'username',
                defaultMessage: 'Username',
              })}
              error={isUsernameInvalid()}
              helperText={
                isUsernameInvalid()
                  ? formatMessage({
                      id: 'username.unavailable',
                      defaultMessage: 'Username unavailable',
                    })
                  : undefined
              }
              onChange={handleChangeUsername}
              value={username}
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {renderUsernameCheck()}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <Button
              disabled={
                profileUpdater.onPostMetadataMutation.isLoading ||
                profileUpdater.onPostOnlyUsernameMetadataMutation.isLoading ||
                (lazyUsername !== (profileQuery.data?.username || '') &&
                  !profileChecker.data?.isAvailable) ||
                username === ''
              }
              onClick={handleSaveProfile}
              startIcon={
                profileUpdater.onPostMetadataMutation.isLoading ||
                profileUpdater.onPostOnlyUsernameMetadataMutation.isLoading ? (
                  <CircularProgress color="inherit" size="1rem" />
                ) : (
                  <Edit />
                )
              }
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Box>
        </Stack>
      </MainLayout>
    </>
  );
};

export default ProfileEditPage;
