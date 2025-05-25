import {
  Button,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ImageIcon from '@mui/icons-material/Image';
import dynamic from 'next/dynamic';
import * as Yup from 'yup';
import { getUsernameExists } from '../../services';
const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'));

export interface UserForm {
  username?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  bio?: string;
  shortBio?: string;
}

const FormSchema: Yup.SchemaOf<UserForm> = Yup.object().shape({
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
});

const EditFormSchema: Yup.SchemaOf<UserForm> = Yup.object().shape({
  username: Yup.string().required(),

  profileImageURL: Yup.string().url(),
  backgroundImageURL: Yup.string().url(),
  bio: Yup.string(),
  shortBio: Yup.string(),
});

interface Props {
  isEdit?: boolean;
  initialValues?: UserForm | null;
  onSubmit?: (form: UserForm) => void;
  onChange?: (form: UserForm) => void;
}

const EmptyImageBackground = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const BackgroundImage = styled('img')(({ theme }) => ({
  height: theme.spacing(10),
  width: theme.spacing(10),
}));

const EmptyImageProfile = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(10),
  width: theme.spacing(10),
}));

export default function UserGeneralForm({
  onSubmit,
  onChange,
  initialValues,
}: Props) {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();
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
                  <Button
                    onClick={() => {
                      setOpenMediaDialog(true);
                      setMediaFieldToEdit('profileImageURL');
                    }}
                  >
                    {values.profileImageURL ? (
                      <BackgroundImage src={values.profileImageURL} />
                    ) : (
                      <EmptyImageProfile />
                    )}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <FormattedMessage
                      id="backgroundImage"
                      defaultMessage="Background Image"
                    />
                  </Typography>
                  <Button
                    onClick={() => {
                      setOpenMediaDialog(true);
                      setMediaFieldToEdit('backgroundImageURL');
                    }}
                  >
                    {values.backgroundImageURL ? (
                      <BackgroundImage src={values.backgroundImageURL} />
                    ) : (
                      <EmptyImageBackground />
                    )}
                  </Button>
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
