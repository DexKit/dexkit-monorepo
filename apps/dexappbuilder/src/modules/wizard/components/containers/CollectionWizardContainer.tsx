import { Typography } from '@mui/material';

import { isAddressEqual } from '@dexkit/core/utils/blockchain';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';

import {
  AppCollection,
  AppConfig,
} from '@dexkit/ui/modules/wizard/types/config';
import { collectionAtom } from '../../state';
import { CollectionPreviewPaper } from '../sections/CollectionPreviewPaper';
import CollectionsSection from '../sections/CollectionsSection';

export interface Form {
  chainId: number;
  contractAddress: string;
  name: string;
  backgroundUrl: string;
  imageUrl: string;
  description?: string;
  uri?: string;
  disableSecondarySells?: boolean;
}

interface Props {
  site?: SiteResponse | null;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

export default function CollectionWizardContainer({
  site,
  config,
  onSave,
  onHasChanges,
}: Props) {
  const { formatMessage } = useIntl();
  const [previewCollection, setPreviewCollection] = useAtom(collectionAtom);
  const [hasChanged, setHashChanged] = useState(false);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [hasChanged, onHasChanges]);

  const { enqueueSnackbar } = useSnackbar();
  const [collections, setCollections] = useState<AppCollection[]>(
    config.collections || [],
  );
  const [selectedEditCollection, setSelectedEditCollection] = useState<Form>();

  const appUrl = useMemo(() => {
    if (site?.domain) {
      return `https://${site?.domain}`;
    }
    if (site?.previewUrl) {
      return site?.previewUrl;
    }
  }, [site]);

  const handleSubmitCollection = (form: Form) => {
    setHashChanged(true);
    setCollections((value) => [
      ...value,
      {
        chainId: form.chainId,
        backgroundImage: form.backgroundUrl,
        contractAddress: form.contractAddress,
        description: form.description,
        image: form.imageUrl,
        name: form.name,
        disableSecondarySells: form?.disableSecondarySells,
      },
    ]);
  };

  const handleRemoveCollection = useCallback((collection: AppCollection) => {
    setCollections((value) => {
      const newCollections = [...value];

      const index = newCollections.findIndex(
        (c) =>
          c.chainId === collection.chainId &&
          isAddressEqual(c.contractAddress, collection.contractAddress),
      );

      newCollections.splice(index, 1);

      enqueueSnackbar(
        formatMessage({
          defaultMessage: 'Collection removed',
          id: 'collection.removed',
        }),
        {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        },
      );
      setHashChanged(true);

      return newCollections;
    });
  }, []);

  const handleEditCollection = useCallback(
    (form: Form) => {
      setCollections((value) => {
        const newCollections = [...value];

        if (!selectedEditCollection) {
          return newCollections;
        }

        const index = newCollections.findIndex(
          (c) =>
            c.chainId === selectedEditCollection.chainId &&
            isAddressEqual(
              c.contractAddress,
              selectedEditCollection.contractAddress,
            ),
        );

        if (index > -1) {
          newCollections[index] = {
            chainId: form.chainId,
            backgroundImage: form.backgroundUrl,
            contractAddress: form.contractAddress,
            description: form.description,
            image: form.imageUrl,
            name: form.name,
            disableSecondarySells: form?.disableSecondarySells,
          };
        } else {
          newCollections.push({
            chainId: form.chainId,
            backgroundImage: form.backgroundUrl,
            contractAddress: form.contractAddress,
            description: form.description,
            image: form.imageUrl,
            name: form.name,
            disableSecondarySells: form?.disableSecondarySells,
          });
        }

        enqueueSnackbar(
          formatMessage({
            defaultMessage: 'Collection saved',
            id: 'collection.saved',
          }),
          {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          },
        );
        setHashChanged(true);

        setSelectedEditCollection(undefined);

        return newCollections;
      });
    },
    [selectedEditCollection],
  );

  const handleCloseCollectionPreview = () => {
    setPreviewCollection(undefined);
  };

  const handleCollectionSelectEdit = useCallback((form: Form) => {
    setSelectedEditCollection(form);
  }, []);

  const handleSave = () => {
    const newConfig = { ...config, collections };
    onSave(newConfig);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="collections" defaultMessage="Collections" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="select.collections.to.display.in.your.app"
              defaultMessage="Select collections to display in your app"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">
          <FormattedMessage
            id="wizard.collections.section.info"
            defaultMessage="Collections displayed by default on collection list page"
          />
        </Alert>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CollectionsSection
          appUrl={appUrl}
          onSubmit={handleSubmitCollection}
          collections={collections}
          onRemove={handleRemoveCollection}
          onEdit={handleEditCollection}
          onSelectEdit={handleCollectionSelectEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {previewCollection && (
          <CollectionPreviewPaper
            previewCollection={previewCollection}
            onClose={handleCloseCollectionPreview}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanged}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
