import {
  Alert,
  Button,
  Grid,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import AddIcon from '@mui/icons-material/Add';
import { useUpdateAtom } from 'jotai/utils';
import { Key, useCallback, useState } from 'react';

import { AppCollection } from '@dexkit/ui/modules/wizard/types/config';
import { collectionAtom } from '../../state';
import CollectionsSectionForm, { Form } from './CollectionsSectionForm';
import CollectionsSectionItem from './CollectionsSectionItem';

interface Props {
  appUrl?: string;
  collections?: AppCollection[];
  onSubmit: (form: Form) => void;
  onRemove: (collection: AppCollection) => void;
  onEdit: (form: Form) => void;
  onSelectEdit: (form: Form) => void;
}

export default function CollectionsSection({
  appUrl,
  onSubmit,
  collections,
  onRemove,
  onEdit,
  onSelectEdit,
}: Props) {
  const setPreviewCollection = useUpdateAtom(collectionAtom);

  const [showForm, setShowForm] = useState(false);
  const [showRemoveCollection, setShowRemoveCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<AppCollection>();

  const [initialValues, setInitialValues] = useState<Form>();

  const handleSubmit = (form: Form) => {
    if (initialValues) {
      setInitialValues(undefined);
      onEdit(form);
    } else {
      onSubmit(form);
    }

    setShowForm(false);
    setPreviewCollection(undefined);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    if (initialValues) {
      setInitialValues(undefined);
    }
    setPreviewCollection(undefined);
    setShowForm(false);
  };

  const handleRemove = useCallback((collection: AppCollection) => {
    setSelectedCollection(collection);
    setShowRemoveCollection(true);
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEdit = useCallback(
    (collection: AppCollection) => {
      let col = {
        backgroundUrl: collection.backgroundImage,
        chainId: collection.chainId,
        contractAddress: collection.contractAddress,
        imageUrl: collection.image,
        name: collection.name,
        description: collection.description,
        uri: collection.uri,
        disableSecondarySells: collection?.disableSecondarySells,
      };

      setInitialValues(col);
      onSelectEdit(col);

      setShowForm(true);

      if (!isMobile) {
        setPreviewCollection(collection);
      }
    },
    [onSelectEdit, isMobile],
  );

  const handlePreview = (collection: AppCollection) => {
    setPreviewCollection(collection);
  };

  const handleCloseRemoveCollection = () => {
    setShowRemoveCollection(false);
    setSelectedCollection(undefined);
  };

  const handleConfirmRemove = () => {
    if (selectedCollection) {
      onRemove(selectedCollection);
      setShowRemoveCollection(false);
      setSelectedCollection(undefined);
    }
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          maxWidth: 'xs',
          fullWidth: true,
          open: showRemoveCollection,
          onClose: handleCloseRemoveCollection,
        }}
        onConfirm={handleConfirmRemove}
      >
        <FormattedMessage
          id="do.you.want.to.remove.this.collection"
          defaultMessage="Do you want to remove this collection?"
        />
      </AppConfirmDialog>
      <Stack spacing={2}>
        {!showForm && collections !== undefined && collections?.length > 0 ? (
          <Stack spacing={2}>
            {collections?.map(
              (collection: AppCollection, index: Key | null | undefined) => (
                <CollectionsSectionItem
                  appUrl={appUrl}
                  key={index}
                  collection={collection}
                  onRemove={handleRemove}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  disabled={showForm}
                />
              ),
            )}
          </Stack>
        ) : (
          <Alert severity="info">
            <FormattedMessage
              id="add.collection.to.your.app"
              defaultMessage="Add collection to your app"
            />
          </Alert>
        )}

        {showForm && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <CollectionsSectionForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </Paper>
          </Grid>
        )}

        {!showForm && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleShowForm}
            color="primary"
            startIcon={<AddIcon />}
          >
            <FormattedMessage
              id="add.collection"
              defaultMessage="Add collection"
            />
          </Button>
        )}
      </Stack>
    </>
  );
}
