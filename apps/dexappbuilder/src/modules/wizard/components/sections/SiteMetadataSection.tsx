import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import Check from '@mui/icons-material/Check';
import Visibility from '@mui/icons-material/Visibility';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useUpsertSiteMetadataMutation } from 'src/hooks/whitelabel';
import * as Yup from 'yup';

import { SiteMetadata } from '@dexkit/ui/modules/wizard/types';
import CreateSiteMetadataDialog from '../dialogs/CreateSiteMetadataDialog';
import SiteMetadataForm from '../forms/SiteMetadataForm';

interface Props {
  id?: number;
  slug?: string;
  siteMetadata?: SiteMetadata;
}

export const SiteMedatadataSchema = Yup.object().shape({
  title: Yup.string().required(),
  subtitle: Yup.string().required(),
  description: Yup.string().required(),
  imageURL: Yup.string().required(),
  chainIds: Yup.array().of(Yup.number()),
  usecases: Yup.array().of(Yup.string()),
});

export default function SiteMetadataSection({ id, slug, siteMetadata }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);
  const [values, setValues] = useState<SiteMetadata>();
  const upsertSiteMetadataMutation = useUpsertSiteMetadataMutation();
  const handleSubmitCollectionItemsForm = async (values: SiteMetadata) => {
    setShowConfirmSendConfig(true);
    setValues(values);
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirmSendConfig,
          maxWidth: 'md',
          fullWidth: true,
          onClose: () => setShowConfirmSendConfig(false),
        }}
        onConfirm={async () => {
          if (values) {
            setShowConfirmSendConfig(false);
            setOpen(true);
            await upsertSiteMetadataMutation.mutateAsync({
              siteId: id,
              siteMetadata: values,
            });
            setValues(undefined);
          }
        }}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="site.metadata"
              defaultMessage="Site metadata"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="update.site.metadata"
              defaultMessage="Update site metadata?"
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <CreateSiteMetadataDialog
        dialogProps={{
          open,
          onClose: () => {
            setOpen(false);
            upsertSiteMetadataMutation.reset();
          },
        }}
        isEdit={slug !== undefined}
        isDone={upsertSiteMetadataMutation.isSuccess}
        isLoading={upsertSiteMetadataMutation.isLoading}
        isError={upsertSiteMetadataMutation.isError}
      />
      <Formik
        initialValues={
          siteMetadata
            ? {
                title: siteMetadata.title,
                subtitle: siteMetadata.subtitle,
                imageURL: siteMetadata.imageURL,
                description: siteMetadata.description,
                chainIds: siteMetadata.chainIds,
                usecases: siteMetadata.usecases,
              }
            : { title: '', subtitle: '', description: '', imageURL: '' }
        }
        onSubmit={handleSubmitCollectionItemsForm}
        validationSchema={SiteMedatadataSchema}
      >
        {({ submitForm, isValid, dirty }) => (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SiteMetadataForm />
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                {slug && (
                  <Button
                    startIcon={<Visibility />}
                    href={`/site/template/${slug}`}
                    target={'_blank'}
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage
                      id="view.site.metadata"
                      defaultMessage="View site metadata"
                    />
                  </Button>
                )}
                <Button
                  startIcon={<Check />}
                  disabled={!isValid || !dirty}
                  onClick={submitForm}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {slug ? (
                    <FormattedMessage
                      id="update.metadata"
                      defaultMessage="Update metadata"
                    />
                  ) : (
                    <FormattedMessage
                      id="create.metadata"
                      defaultMessage="Create metadata"
                    />
                  )}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Formik>
    </>
  );
}
