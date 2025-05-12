import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { MouseEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ExtendedAsset } from '@dexkit/ui/types/ai';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CollectionsIcon from '@mui/icons-material/Collections';
import ImageIcon from '@mui/icons-material/Image';
import dynamic from 'next/dynamic';
import * as Yup from 'yup';
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
});

const EditFormSchema = Yup.object().shape({
  username: Yup.string().required(),
  profileImageURL: Yup.string().url(),
  backgroundImageURL: Yup.string().url(),
  bio: Yup.string(),
  shortBio: Yup.string(),
  profileNft: Yup.mixed(),
});

interface Props {
  isEdit?: boolean;
  initialValues?: UserForm | null;
  onSubmit?: (form: UserForm) => void;
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
  objectFit: "contain",
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
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  
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
            }
          }
          onSubmit={(values, helpers) => {
            if (onSubmit) {
              onSubmit(values as UserForm);
              helpers.resetForm({ values });
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
                      if (onChange) {
                        onChange({ ...values, [mediaFieldToEdit]: file.url });
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
                  try {
                    const imageUrl = nft.imageUrl || nft.metadata?.image || '';
                    
                    setFieldValue('profileNft', nft);
                    setFieldValue('profileImageURL', imageUrl);
                    
                    if (onChange) {
                      onChange({
                        ...values,
                        profileNft: nft,
                        profileImageURL: imageUrl,
                      });
                    }
                  } catch (error) {
                    console.error("Error selecting NFT:", error);
                  }
                  
                  setOpenNftSelector(false);
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
                          boxShadow: 2
                        }
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
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      {values.profileNft.metadata?.name || values.profileNft.name || values.profileNft.collectionName}
                      {values.profileNft.networkId && (
                        <Chip 
                          size="small"
                          label={values.profileNft.networkId.charAt(0).toUpperCase() + values.profileNft.networkId.slice(1)}
                          color="primary"
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
                          boxShadow: 2
                        }
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
                      disabled={!isValid}
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Stack>
    </>
  );
}
