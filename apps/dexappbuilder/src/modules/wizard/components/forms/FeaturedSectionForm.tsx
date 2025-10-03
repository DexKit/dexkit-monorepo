import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import { SectionItem } from '@dexkit/ui/modules/wizard/types/config';
import {
  AppPageSection,
  FeaturedAppPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup';
import { PageSectionItem } from '../PageSectionItem';
import AddItemForm from './AddItemForm';
interface Form {
  title: string;
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  title: Yup.string().required(),
});

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: FeaturedAppPageSection;
}

export default function FeaturedSectionForm({
  onSave,
  onCancel,
  onChange,
  section,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAddItem, setShowAddItem] = useState(false);

  const [items, setItems] = useState<SectionItem[]>(
    section ? section.items : [],
  );

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    onSave({
      type: 'featured',
      items,
      title: values.title,
    });
  };

  const formik = useFormik({
    initialValues: section
      ? {
        title: section.title,
      }
      : {
        title: '',
      },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  const handleAddItem = () => {
    setSelectedItemIndex(-1);
    setShowAddItem(true);
  };

  const handleSubmitItem = (item: SectionItem) => {
    if (selectedItemIndex > -1) {
      setItems((value: any) => {
        const newItems = [...value];

        newItems[selectedItemIndex] = item;

        return newItems;
      });
    } else {
      setItems((value: any) => [...value, item]);
    }

    setSelectedItemIndex(-1);
    setShowAddItem(false);
  };

  const handleCancelItem = () => {
    setSelectedItemIndex(-1);
    setShowAddItem(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((items: SectionItem[]) => {
      let newItems = [...items];

      newItems.splice(index, 1);

      return newItems;
    });
  };

  const handleEditItem = (index: number) => {
    setSelectedItemIndex(index);
    setShowAddItem(true);
  };

  const handleSwapItem = (direction: 'up' | 'down', index: number) => {
    setItems((items: SectionItem[]) => {
      let newItems = [...items];
      if (direction === 'up') {
        const swapItem = newItems[index - 1];
        newItems[index - 1] = newItems[index];
        newItems[index] = swapItem;
      } else {
        const swapItem = newItems[index + 1];
        newItems[index + 1] = newItems[index];
        newItems[index] = swapItem;
      }
      return newItems;
    });
  };

  useEffect(() => {
    onChange({
      type: 'featured',
      items,
      title: formik.values.title,
    });
  }, [formik.values, items]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ px: isMobile ? 2 : 0 }}>
        <Grid container spacing={isMobile ? 1.5 : 2}>
        <Grid size={12}>
          <CompletationProvider
            onCompletation={(output: string) => {
              formik.setFieldValue('title', output);
            }}
            initialPrompt={formik.values.title}
          >
            {({ inputAdornment, ref }) => (
              <TextField
                name="title"
                onChange={formik.handleChange}
                fullWidth
                size={isMobile ? "small" : "medium"}
                value={formik.values.title}
                label={<FormattedMessage id="title" defaultMessage="Title" />}
                error={Boolean(formik.errors.title)}
                helperText={
                  Boolean(formik.errors.title) ? formik.errors.title : undefined
                }
                inputRef={ref}
                InputProps={{ endAdornment: inputAdornment('end') }}
              />
            )}
          </CompletationProvider>
        </Grid>
        {!showAddItem &&
          items.map((item: any, index: any) => (
            <Grid key={index} sx={{ mb: isMobile ? 0.5 : 1 }} size={12}>
              <PageSectionItem
                item={item}
                length={items.length}
                onRemove={handleRemoveItem}
                onEdit={handleEditItem}
                onSwap={handleSwapItem}
                index={index}
              />
            </Grid>
          ))}
        {showAddItem ? (
          <Grid size={12}>
            <Paper sx={{ p: isMobile ? 1 : 2 }}>
              <AddItemForm
                key={selectedItemIndex > -1 ? `edit-${selectedItemIndex}` : 'add-new'}
                item={
                  selectedItemIndex === -1
                    ? undefined
                    : items[selectedItemIndex]
                }
                onCancel={handleCancelItem}
                onSubmit={handleSubmitItem}
              />
            </Paper>
          </Grid>
        ) : (
          <Grid size={12}>
            <Button
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              variant="outlined"
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiButton-startIcon': {
                  marginRight: isMobile ? 2 : 4,
                  "& > *:nth-of-type(1)": {
                    fontSize: isMobile ? 16 : 20,
                  }
                }
              }}
            >
              <FormattedMessage id="add.item" defaultMessage="Add item" />
            </Button>
          </Grid>
        )}

        <Grid size={12}>
          <Stack spacing={isMobile ? 1 : 2} direction="row" justifyContent="flex-end">
            <Button onClick={onCancel} size={isMobile ? "small" : "medium"}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={!formik.isValid}
              type="submit"
              variant="contained"
              color="primary"
              size={isMobile ? "small" : "medium"}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
      </Box>
    </form>
  );
}
