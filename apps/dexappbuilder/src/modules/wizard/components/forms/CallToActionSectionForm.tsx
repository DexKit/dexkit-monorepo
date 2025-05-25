import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import AddIcon from '@mui/icons-material/Add';

import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import {
  PageSectionVariant,
  SectionItem,
} from '@dexkit/ui/modules/wizard/types/config';
import {
  AppPageSection,
  CallToActionAppPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import * as Yup from 'yup';
import { PageSectionItem } from '../PageSectionItem';
import AddItemForm from './AddItemForm';

interface ButtonData {
  title: string;
  url: string;
  openInNewPage?: boolean;
}

interface Form {
  variant: string;
  type: string;
  title: string;
  subtitle: string;
  button: ButtonData;
}

const FormSchema = Yup.object().shape({
  variant: Yup.string().required(),
  type: Yup.string().required(),
  title: Yup.string().required(),
  subtitle: Yup.string().required(),
  button: Yup.object().shape({
    title: Yup.string().required(),
    url: Yup.string().required(),
    openInNewPage: Yup.boolean().optional(),
  }),
});

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: CallToActionAppPageSection;
}

export default function CallToActionSectionForm({
  onSave,
  onCancel,
  onChange,
  section,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAddItem, setShowAddItem] = useState(false);

  const [items, setItems] = useState<SectionItem[]>(
    section ? section.items || [] : [],
  );

  const handleSubmit = (values: Form) => {
    onSave({
      button: values.button,
      type: 'call-to-action',
      items,
      subtitle: values.subtitle,
      title: values.title,
      variant: values.variant as PageSectionVariant,
    });
  };

  const formik = useFormik<Form>({
    initialValues: section
      ? {
        button: section?.button || { title: '', url: '' },
        subtitle: section?.subtitle || '',
        title: section?.title || '',
        type: 'call-to-action',
        variant: section.variant || 'light',
      }
      : {
        title: '',
        subtitle: '',
        button: { title: '', url: '' },
        type: 'call-to-action',
        variant: 'light',
      },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  useEffect(() => {
    onChange({
      button: formik.values.button,
      type: 'call-to-action',
      items,
      subtitle: formik.values.subtitle,
      title: formik.values.title,
      variant: formik.values.variant as PageSectionVariant,
    });
  }, [formik.values, items]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const handleCancelItem = () => {
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

  const handleAddItem = () => {
    setShowAddItem(true);
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

    setShowAddItem(false);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={isMobile ? theme.spacing(1.5) : theme.spacing(2)}>
        <Grid item xs={12}>
          <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
            <InputLabel>
              <FormattedMessage id="variant" defaultMessage="Variant" />
            </InputLabel>
            <Select
              required
              label={<FormattedMessage id="variant" defaultMessage="Variant" />}
              fullWidth
              value={formik.values.variant}
              name="variant"
              onChange={formik.handleChange}
            >
              <MenuItem value="light">
                <FormattedMessage id="light" defaultMessage="Light" />
              </MenuItem>
              <MenuItem value="dark">
                <FormattedMessage id="dark" defaultMessage="Dark" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <CompletationProvider
            onCompletation={(output: string) => {
              formik.setFieldValue('title', output);
            }}
            initialPrompt={formik.values.title}
          >
            {({ ref, inputAdornment }) => (
              <TextField
                name="title"
                size={isMobile ? "small" : "medium"}
                onChange={formik.handleChange}
                fullWidth
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
        <Grid item xs={12}>
          <CompletationProvider
            onCompletation={(output: string) => {
              formik.setFieldValue('subtitle', output);
            }}
            initialPrompt={formik.values.subtitle}
          >
            {({ ref, inputAdornment }) => (
              <TextField
                name="subtitle"
                size={isMobile ? "small" : "medium"}
                onChange={formik.handleChange}
                fullWidth
                value={formik.values.subtitle}
                label={
                  <FormattedMessage id="subtitle" defaultMessage="Subtitle" />
                }
                error={Boolean(formik.errors.subtitle)}
                helperText={
                  Boolean(formik.errors.subtitle)
                    ? formik.errors.subtitle
                    : undefined
                }
                inputRef={ref}
                InputProps={{ endAdornment: inputAdornment('end') }}
              />
            )}
          </CompletationProvider>
        </Grid>
        <Grid item xs={12}>
          <CompletationProvider
            onCompletation={(output: string) => {
              formik.setFieldValue('button.title', output);
            }}
            initialPrompt={formik.values.button.title}
          >
            {({ ref, inputAdornment }) => (
              <TextField
                name="button.title"
                size={isMobile ? "small" : "medium"}
                onChange={formik.handleChange}
                fullWidth
                value={formik.values.button.title}
                label={
                  <FormattedMessage
                    id="button.title"
                    defaultMessage="Button Title"
                  />
                }
                error={Boolean(formik.errors.button?.title)}
                helperText={
                  Boolean(formik.errors.button?.title)
                    ? formik.errors.button?.title
                    : undefined
                }
                inputRef={ref}
                InputProps={{ endAdornment: inputAdornment('end') }}
              />
            )}
          </CompletationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="button.url"
            size={isMobile ? "small" : "medium"}
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.button.url}
            label={
              <FormattedMessage id="button.url" defaultMessage="Button URL" />
            }
            error={Boolean(formik.errors.button?.url)}
            helperText={
              Boolean(formik.errors.button?.url)
                ? formik.errors.button?.url
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formik.values.button.openInNewPage)}
                onChange={(ev) =>
                  formik.setFieldValue(
                    'button.openInNewPage',
                    ev.target.checked,
                  )
                }
              />
            }
            label={
              <FormattedMessage
                id="open.in.new.page"
                defaultMessage="Open in new page"
              />
            }
          />
        </Grid>
        {!showAddItem &&
          items.map((item, index) => (
            <Grid item xs={12} key={index} sx={{ mb: isMobile ? theme.spacing(0.5) : theme.spacing(1) }}>
              <PageSectionItem
                item={item}
                length={items.length}
                onEdit={handleEditItem}
                onRemove={handleRemoveItem}
                onSwap={handleSwapItem}
                index={index}
              />
            </Grid>
          ))}
        {showAddItem ? (
          <Grid item xs={12}>
            <Paper sx={{ p: isMobile ? theme.spacing(1) : theme.spacing(2) }}>
              <AddItemForm
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
          <Grid item xs={12}>
            <Button
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              variant="outlined"
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiButton-startIcon': {
                  marginRight: isMobile ? theme.spacing(2) : theme.spacing(4),
                  "& > *:nth-of-type(1)": {
                    fontSize: isMobile ? theme.typography.fontSize * 1.1 : theme.typography.fontSize * 1.4,
                  }
                }
              }}
            >
              <FormattedMessage id="add.item" defaultMessage="Add item" />
            </Button>
          </Grid>
        )}

        <Grid item xs={12}>
          <Stack spacing={isMobile ? theme.spacing(1) : theme.spacing(2)} direction="row" justifyContent="flex-end">
            <Button
              onClick={onCancel}
              size={isMobile ? "small" : "medium"}
            >
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
    </form>
  );
}
