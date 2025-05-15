import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { MouseEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import { ExtendedAsset } from '@dexkit/ui/types/ai';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CollectionsIcon from '@mui/icons-material/Collections';
import ImageIcon from '@mui/icons-material/Image';
import dynamic from 'next/dynamic';
import * as Yup from 'yup';
import {
  useSetNftProfileMutation,
  useValidateNFTOwnershipMutation,
} from '../../hooks';
import { getUsernameExists } from '../../services';
import { DirectNftSelector } from '../DirectNftSelector';

const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'));

export interface UserForm {
  username?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  bio?: string;
  shortBio?: string;
  profileNft?: ExtendedAsset;
  nftChainId?: number;
  nftAddress?: string;
  nftId?: string;
  dbAssetId?: number;
}

const FormSchema = Yup.object().shape({
  username: Yup.string()
    .required()
    .test(
      'username-backend-validation', // Name
      'Username already taken', // Msg
      async (username) => {
        // Res from backend will be flag at res.data.success, true for
        // username good, false otherwise
        if (username) {
          const { data } = await getUsernameExists(username);
          return !data;
        }
        return false;
      },
    ),
  profileImageURL: Yup.string().url(),
  backgroundImageURL: Yup.string().url(),
  bio: Yup.string(),
  shortBio: Yup.string(),
  profileNft: Yup.mixed(),
  nftChainId: Yup.number(),
  nftAddress: Yup.string(),
  nftId: Yup.string(),
  dbAssetId: Yup.number().optional().nullable(),
});

const EditFormSchema = Yup.object().shape({
  username: Yup.string().required(),
  profileImageURL: Yup.string().url(),
  backgroundImageURL: Yup.string().url(),
  bio: Yup.string(),
  shortBio: Yup.string(),
  profileNft: Yup.mixed(),
  nftChainId: Yup.number(),
  nftAddress: Yup.string(),
  nftId: Yup.string(),
  dbAssetId: Yup.number().optional().nullable(),
});

interface Props {
  isEdit?: boolean;
  initialValues?: UserForm | null;
  onSubmit?: (form: UserForm) => Promise<void> | void;
  onChange?: (form: UserForm) => void;
}

const EmptyImageBackground = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(15),
  width: theme.spacing(15),
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
}));

const BackgroundImage = styled('img')(({ theme }) => ({
  height: theme.spacing(15),
  width: theme.spacing(15),
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
}));

const EmptyImageProfile = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(15),
  width: theme.spacing(15),
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
}));

export default function UserGeneralForm({
  onSubmit,
  onChange,
  initialValues,
}: Props) {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();
  const [openNftSelector, setOpenNftSelector] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const validateNFTMutation = useValidateNFTOwnershipMutation();
  const setNftProfileMutation = useSetNftProfileMutation();
  const { account, provider } = useWeb3React();

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleSelectFromGallery = () => {
    setMediaFieldToEdit('profileImageURL');
    setOpenMediaDialog(true);
    handleMenuClose();
  };

  const handleSelectFromNFTs = () => {
    setOpenNftSelector(true);
    handleMenuClose();
  };

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <>
      <Stack>
        <Formik
          initialValues={
            initialValues || {
              username: '',
              profileImageURL: '',
              backgroundImageURL: '',
              bio: '',
              shortBio: '',
              profileNft: undefined,
              nftChainId: undefined,
              nftAddress: '',
              nftId: '',
              dbAssetId: undefined,
            }
          }
          onSubmit={async (values, helpers) => {
            setError(null);
            const mainUpsert = async () => {
              if (onSubmit) {
                await Promise.resolve(onSubmit(values as UserForm));
              }
            };

            const setPfpNft = async () => {
              if (
                values.profileNft &&
                values.dbAssetId &&
                account &&
                provider
              ) {
                const nftForMessage = values.profileNft as ExtendedAsset;
                const contractAddress =
                  nftForMessage.contractAddress ||
                  (nftForMessage as any).address;
                const tokenIdForMessage = values.nftId;

                let chainIdForMessageCalc: number | undefined;
                let networkSlugForMessage: string | undefined;

                if (typeof nftForMessage.chainId === 'number') {
                  chainIdForMessageCalc = nftForMessage.chainId;
                } else if (typeof nftForMessage.chainId === 'string') {
                  const parsedChainId = parseInt(nftForMessage.chainId, 10);
                  if (!isNaN(parsedChainId)) {
                    chainIdForMessageCalc = parsedChainId;
                  }
                }

                if (chainIdForMessageCalc === undefined) {
                  if (typeof nftForMessage.networkId === 'number') {
                    chainIdForMessageCalc = nftForMessage.networkId;
                  } else if (typeof nftForMessage.networkId === 'string') {
                    const parsedNetworkIdAsChainId = parseInt(
                      nftForMessage.networkId,
                      10,
                    );
                    if (!isNaN(parsedNetworkIdAsChainId)) {
                      chainIdForMessageCalc = parsedNetworkIdAsChainId;
                    } else {
                      console.warn(
                        'Cannot derive numeric chainId from networkId slug:',
                        nftForMessage.networkId,
                      );
                    }
                  }
                }

                if (
                  chainIdForMessageCalc !== undefined &&
                  !isNaN(chainIdForMessageCalc)
                ) {
                  networkSlugForMessage = getNetworkSlugFromChainId(
                    chainIdForMessageCalc,
                  );
                } else {
                  if (
                    typeof nftForMessage.networkId === 'string' &&
                    isNaN(parseInt(nftForMessage.networkId, 10))
                  ) {
                    networkSlugForMessage = nftForMessage.networkId;
                  } else {
                    setError(
                      'Could not determine a valid chain ID or network slug for the NFT to sign the message.',
                    );
                    console.error(
                      'PFP Sign Message Error: Invalid or missing chain/network identifiers',
                      nftForMessage,
                    );
                    return false;
                  }
                }

                if (!networkSlugForMessage) {
                  setError(
                    'Could not determine a valid network identifier for the NFT message signature.',
                  );
                  console.error(
                    'PFP Sign Message Error: Network slug could not be determined.',
                    nftForMessage,
                  );
                  return false;
                }

                if (!contractAddress || !tokenIdForMessage) {
                  setError(
                    'Missing NFT contract address or token ID to sign the PFP confirmation message.',
                  );
                  console.error(
                    'PFP Sign Message Error: Missing contract or token ID',
                    { contractAddress, tokenIdForMessage },
                  );
                  return false;
                }

                const message = `I confirm that I own NFT ${contractAddress}:${tokenIdForMessage} on ${networkSlugForMessage} network and want to use it as my profile picture.`;

                try {
                  const signer = provider.getSigner();
                  const signature = await signer.signMessage(message);

                  await setNftProfileMutation.mutateAsync({
                    nftId: values.dbAssetId,
                    signature,
                  });
                  return true;
                } catch (err: any) {
                  console.error('Error in setPfpNft:', err);
                  setError(
                    err.data?.message ||
                      err.message ||
                      'Failed to sign message or set NFT as PFP.',
                  );
                  return false;
                }
              }
              return true;
            };

            if (values.nftChainId && values.nftAddress && values.nftId) {
              try {
                await validateNFTMutation.mutateAsync({
                  nftChainId: values.nftChainId,
                  nftAddress: values.nftAddress,
                  nftId: values.nftId,
                });
                await mainUpsert();
                const pfpSuccess = await setPfpNft();
                if (pfpSuccess) {
                  helpers.resetForm({ values });
                }
              } catch (validationOrPfpError: any) {
                console.error(
                  'Error during NFT validation or PFP set:',
                  validationOrPfpError,
                );
                setError(
                  validationOrPfpError.data?.message ||
                    validationOrPfpError.message ||
                    'An error occurred.',
                );
              }
            } else {
              try {
                await mainUpsert();
                if (
                  values.dbAssetId &&
                  !values.profileNft &&
                  account &&
                  provider &&
                  values.username
                ) {
                }
                helpers.resetForm({ values });
              } catch (upsertError: any) {
                console.error(
                  'Error during main upsert (no NFT):',
                  upsertError,
                );
                setError(
                  upsertError.data?.message ||
                    upsertError.message ||
                    'An error occurred while saving profile.',
                );
              }
            }
          }}
          validationSchema={initialValues ? EditFormSchema : FormSchema}
        >
          {({ submitForm, isSubmitting, isValid, setFieldValue, values }) => (
            <form>
              {openMediaDialog && (
                <MediaDialog
                  dialogProps={{
                    open: openMediaDialog,
                    maxWidth: 'lg',
                    fullWidth: true,
                    onClose: () => {
                      setOpenMediaDialog(false);
                      setMediaFieldToEdit(undefined);
                    },
                  }}
                  onConfirmSelectFile={(file) => {
                    if (mediaFieldToEdit && file) {
                      setFieldValue(mediaFieldToEdit, file.url);
                      if (mediaFieldToEdit === 'profileImageURL') {
                        setFieldValue('profileNft', undefined);
                        setFieldValue('nftChainId', undefined);
                        setFieldValue('nftAddress', '');
                        setFieldValue('nftId', '');
                        setFieldValue('dbAssetId', undefined);
                      }
                      if (onChange) {
                        onChange({
                          ...values,
                          [mediaFieldToEdit]: file.url,
                          ...(mediaFieldToEdit === 'profileImageURL' && {
                            profileNft: undefined,
                            nftChainId: undefined,
                            nftAddress: '',
                            nftId: '',
                            dbAssetId: undefined,
                          }),
                        });
                      }
                    }
                    setMediaFieldToEdit(undefined);
                    setOpenMediaDialog(false);
                  }}
                />
              )}

              <DirectNftSelector
                open={openNftSelector}
                onClose={() => setOpenNftSelector(false)}
                selectedNft={values.profileNft}
                onSelect={(nft) => {
                  setError(null);
                  try {
                    const imageUrl = nft.imageUrl || nft.metadata?.image || '';
                    const chainId = nft.chainId || Number(nft.networkId);
                    const address = nft.contractAddress || (nft as any).address;
                    const tokenId = String(nft.id);

                    const dbAssetIdFromNft = nft.dbId;
                    let parsedDbAssetId: number | undefined = undefined;

                    if (typeof dbAssetIdFromNft === 'number') {
                      parsedDbAssetId = dbAssetIdFromNft;
                    } else if (typeof dbAssetIdFromNft === 'string') {
                      const tempId = parseInt(dbAssetIdFromNft, 10);
                      if (!isNaN(tempId)) {
                        parsedDbAssetId = tempId;
                      }
                    }

                    if (parsedDbAssetId === undefined) {
                      console.warn(
                        'Warning: dbAssetId not found or invalid on selected NFT object. PFP set via signature might fail.',
                        nft,
                      );
                    }

                    if (!address) {
                      throw new Error(
                        'The selected NFT does not have a valid contract address',
                      );
                    }
                    if (isNaN(chainId)) {
                      throw new Error(
                        'The selected NFT does not have a valid chainId',
                      );
                    }

                    validateNFTMutation.mutate(
                      {
                        nftChainId: chainId,
                        nftAddress: address,
                        nftId: tokenId,
                      },
                      {
                        onSuccess: () => {
                          setFieldValue('profileNft', nft);
                          setFieldValue('profileImageURL', imageUrl);
                          setFieldValue('nftChainId', chainId);
                          setFieldValue('nftAddress', address);
                          setFieldValue('nftId', tokenId);
                          setFieldValue('dbAssetId', parsedDbAssetId);

                          if (onChange) {
                            onChange({
                              ...values,
                              profileNft: nft,
                              profileImageURL: imageUrl,
                              nftChainId: chainId,
                              nftAddress: address,
                              nftId: tokenId,
                              dbAssetId: parsedDbAssetId,
                            });
                          }
                        },
                        onError: (error: any) => {
                          setError(
                            error.message ||
                              'Error validating NFT ownership on selection.',
                          );
                          setFieldValue('profileNft', undefined);
                          setFieldValue(
                            'profileImageURL',
                            initialValues?.profileImageURL || '',
                          );
                          setFieldValue('nftChainId', undefined);
                          setFieldValue('nftAddress', '');
                          setFieldValue('nftId', '');
                          setFieldValue('dbAssetId', undefined);
                        },
                      },
                    );
                  } catch (e: any) {
                    setError(e.message || 'Error processing selected NFT.');
                  }
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="username"
                    label={
                      <FormattedMessage
                        id="username"
                        defaultMessage="Username"
                      />
                    }
                    InputProps={{ disabled: initialValues ? true : false }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <FormattedMessage
                      id="profileImage"
                      defaultMessage="Profile Image"
                    />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Button
                      onClick={handleProfileClick}
                      sx={{
                        p: 0,
                        borderRadius: 1,
                        '&:hover': {
                          opacity: 0.8,
                          boxShadow: 2,
                        },
                      }}
                    >
                      {values.profileImageURL ? (
                        <BackgroundImage src={values.profileImageURL} />
                      ) : (
                        <EmptyImageProfile />
                      )}
                    </Button>

                    <Menu
                      anchorEl={profileMenuAnchor}
                      open={Boolean(profileMenuAnchor)}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <MenuItem onClick={handleSelectFromGallery}>
                        <ListItemIcon>
                          <AddPhotoAlternateIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          <FormattedMessage
                            id="select.from.gallery"
                            defaultMessage="Select from Gallery"
                          />
                        </ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleSelectFromNFTs}>
                        <ListItemIcon>
                          <CollectionsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          <FormattedMessage
                            id="select.from.nfts"
                            defaultMessage="Select from NFTs"
                          />
                        </ListItemText>
                      </MenuItem>
                    </Menu>
                  </Box>
                  {values.profileNft && (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      {values.profileNft.metadata?.name ||
                        values.profileNft.name ||
                        values.profileNft.collectionName}
                      {values.profileNft.networkId && (
                        <Chip
                          size="small"
                          label={
                            typeof values.profileNft.networkId === 'string'
                              ? values.profileNft.networkId
                                  .charAt(0)
                                  .toUpperCase() +
                                values.profileNft.networkId.slice(1)
                              : values.profileNft.networkId
                          }
                          color="primary"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                      {values.nftAddress && values.nftId && (
                        <Chip
                          size="small"
                          label="NFT"
                          color="secondary"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <FormattedMessage
                      id="backgroundImage"
                      defaultMessage="Background Image"
                    />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Button
                      onClick={() => {
                        setOpenMediaDialog(true);
                        setMediaFieldToEdit('backgroundImageURL');
                      }}
                      sx={{
                        p: 0,
                        borderRadius: 1,
                        '&:hover': {
                          opacity: 0.8,
                          boxShadow: 2,
                        },
                      }}
                    >
                      {values.backgroundImageURL ? (
                        <BackgroundImage src={values.backgroundImageURL} />
                      ) : (
                        <EmptyImageBackground />
                      )}
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="shortBio"
                    label={
                      <FormattedMessage
                        id="shortbio"
                        defaultMessage="Short Bio"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="bio"
                    label={<FormattedMessage id="bio" defaultMessage="Bio" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Button
                      disabled={
                        !isValid ||
                        validateNFTMutation.isLoading ||
                        setNftProfileMutation.isLoading
                      }
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      {validateNFTMutation.isLoading ||
                      setNftProfileMutation.isLoading ? (
                        <FormattedMessage
                          id="saving.profile"
                          defaultMessage="Saving..."
                        />
                      ) : (
                        <FormattedMessage id="save" defaultMessage="Save" />
                      )}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              <Snackbar
                open={error !== null}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert
                  onClose={handleErrorClose}
                  severity="error"
                  sx={{ width: '100%' }}
                >
                  {error}
                </Alert>
              </Snackbar>
            </form>
          )}
        </Formik>
      </Stack>
    </>
  );
}
