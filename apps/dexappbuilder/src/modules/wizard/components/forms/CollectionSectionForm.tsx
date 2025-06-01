import { Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { SectionItem } from '@dexkit/ui/modules/wizard/types/config';
import {
  AppPageSection,
  CollectionAppPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup';
import { PageSectionItem } from '../PageSectionItem';
import AddItemForm from './AddItemForm';

interface Form {
  title: string;
  variant: "grid" | "list" | "carousel" | "cards" | "masonry" | "hero" | "compact";
  hideTitle: boolean;
}

const FormSchema = Yup.object().shape({
  title: Yup.string().required(),
  variant: Yup.string().oneOf(["grid", "list", "carousel", "cards", "masonry", "hero", "compact"] as const).required(),
  hideTitle: Yup.boolean(),
});

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: CollectionAppPageSection;
}

export default function CollectionSectionForm({
  onSave,
  onChange,
  onCancel,
  section,
}: Props) {
  const [showAddItem, setShowAddItem] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const [items, setItems] = useState<SectionItem[]>(
    section ? section.items : [],
  );

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    onSave({
      type: 'collections',
      items,
      title: values.title,
      variant: values.variant,
      hideTitle: values.hideTitle,
    });
  };

  const formik = useFormik({
    initialValues: section
      ? {
          title: section.title,
        variant: section.variant || "grid" as const,
        hideTitle: section.hideTitle || false,
        }
      : {
          title: '',
        variant: "grid" as const,
        hideTitle: false,
        },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

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

  const handleAddItem = () => {
    setSelectedItemIndex(-1);
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

  const handleSubmitItem = (item: SectionItem) => {
    if (selectedItemIndex > -1) {
      setItems((value) => {
        const newItems = [...value];

        newItems[selectedItemIndex] = item;

        return newItems;
      });
    } else {
      setItems((value) => [...value, item]);
    }

    setSelectedItemIndex(-1);
    setShowAddItem(false);
  };

  const handleCancelItem = () => {
    setSelectedItemIndex(-1);
    setShowAddItem(false);
  };

  useEffect(() => {
    onChange({
      type: 'collections',
      items,
      title: formik.values.title,
      variant: formik.values.variant,
      hideTitle: formik.values.hideTitle,
    });
  }, [formik.values, items]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
        <Grid item xs={12}>
          <TextField
            name="title"
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.title}
            label={<FormattedMessage id="title" defaultMessage="Title" />}
            error={Boolean(formik.errors.title)}
            helperText={
              Boolean(formik.errors.title) ? formik.errors.title : undefined
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="variant-label">
              <FormattedMessage id="display.variant" defaultMessage="Display Variant" />
            </InputLabel>
            <Select
              labelId="variant-label"
              name="variant"
              value={formik.values.variant}
              onChange={formik.handleChange}
              label={<FormattedMessage id="display.variant" defaultMessage="Display Variant" />}
            >
              <MenuItem value="grid">
                <FormattedMessage id="variant.grid" defaultMessage="Grid" />
              </MenuItem>
              <MenuItem value="list">
                <FormattedMessage id="variant.list" defaultMessage="List" />
              </MenuItem>
              <MenuItem value="carousel">
                <FormattedMessage id="variant.carousel" defaultMessage="Carousel" />
              </MenuItem>
              <MenuItem value="cards">
                <FormattedMessage id="variant.cards" defaultMessage="Cards" />
              </MenuItem>
              <MenuItem value="masonry">
                <FormattedMessage id="variant.masonry" defaultMessage="Masonry" />
              </MenuItem>
              <MenuItem value="hero">
                <FormattedMessage id="variant.hero" defaultMessage="Hero" />
              </MenuItem>
              <MenuItem value="compact">
                <FormattedMessage id="variant.compact" defaultMessage="Compact" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Hide Title Toggle - Show for variants that support hiding titles */}
        {(formik.values.variant === "grid" ||
          formik.values.variant === "masonry" ||
          formik.values.variant === "hero") && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.hideTitle || false}
                    onChange={(e) => {
                      formik.setFieldValue('hideTitle', e.target.checked);
                    }}
                    color="primary"
                  />
                }
                label={
                  <FormattedMessage
                    id="hide.collection.titles"
                    defaultMessage="Hide collection titles"
                  />
                }
              />
            </Grid>
          )}

        {!showAddItem &&
          items.map((item, index) => (
            <Grid item xs={12} key={index}>
              <PageSectionItem
                item={item}
                length={items.length}
                index={index}
                onEdit={handleEditItem}
                onSwap={handleSwapItem}
                onRemove={handleRemoveItem}
              />
            </Grid>
          ))}
        {showAddItem ? (
          <Grid item xs={12}>
            <Paper>
              <AddItemForm
                key={selectedItemIndex > -1 ? `edit-${selectedItemIndex}` : 'add-new'}
                item={
                  selectedItemIndex > -1 ? items[selectedItemIndex] : undefined
                }
                onCancel={handleCancelItem}
                onSubmit={handleSubmitItem}
              />
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Button
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              variant="outlined"
              fullWidth
            >
              <FormattedMessage id="add.item" defaultMessage="Add item" />
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button onClick={onCancel}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              disabled={!formik.isValid}
              type="submit"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
