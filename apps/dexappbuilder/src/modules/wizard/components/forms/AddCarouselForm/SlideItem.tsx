import Check from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Image from '@mui/icons-material/Image';
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Field, useField } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { CORE_PAGES } from '@/modules/wizard/constants';
import { CarouselSlide } from '@dexkit/ui/modules/wizard/types/section';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FormikMuiColorInput from '../../FormikMuiColorInput';

export interface SlideItemProps {
  index: number;
  onRemove: () => void;
  onSelectImage: () => void;
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

export default function SlideItem({
  index,
  disableUp,
  disableDown,
  onRemove,
  onSelectImage,
  onUp,
  onDown,
}: SlideItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [props, meta, helpers] = useField<CarouselSlide>(`slides[${index}]`);

  const [imgProps, imgMeta, imgHelpers] = useField<string>(
    `slides[${index}].imageUrl`,
  );

  const [perProps, perMeta, perImgHelpers] = useField<number>(
    `slides[${index}].overlayPercentage`,
  );

  const allPages = useMemo(() => {
    return Object.keys(CORE_PAGES).map((key) => ({
      page: key,
      uri: CORE_PAGES[key].uri,
    }));
  }, []);

  if (isEditing) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id="carousel.image.aspectRatio"
              defaultMessage="The image must have a 16/9 aspect ratio to be displayed correctly in the carousel."
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            fullWidth
            label={
              <FormattedMessage id="image.url" defaultMessage="Image URL" />
            }
            name={`slides[${index}].imageUrl`}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              shrink: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onSelectImage}>
                    <Image />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormikMuiColorInput
            fullWidth
            label={
              <FormattedMessage
                id="overlay.color"
                defaultMessage="Overlay color"
              />
            }
            format="rgb"
            name={`slides[${index}].overlayColor`}
          />
        </Grid>
        <Grid item xs={12}>
          <Slider
            value={perProps.value || 0}
            onChange={(e, value) => {
              if (!Array.isArray(value)) {
                perImgHelpers.setValue(value);
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            fullWidth
            name={`slides[${index}].title`}
            label={<FormattedMessage id="title" defaultMessage="Title" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            fullWidth
            name={`slides[${index}].subtitle`}
            label={<FormattedMessage id="subtitle" defaultMessage="subtitle" />}
          />
        </Grid>
        <Grid item xs={12}>
          <FormikMuiColorInput
            fullWidth
            label={
              <FormattedMessage id="text.color" defaultMessage="Text color" />
            }
            format="rgb"
            name={`slides[${index}].textColor`}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            fullWidth
            label={
              <FormattedMessage
                id="button.cation"
                defaultMessage="Button caption"
              />
            }
            name={`slides[${index}].action.caption`}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Field
              fullWidth
              component={Select}
              name={`slides[${index}].action.type`}
              label={
                <FormattedMessage
                  id="action.type"
                  defaultMessage="Action type"
                />
              }
            >
              <MenuItem value="link">
                <FormattedMessage id="link" defaultMessage="Link" />
              </MenuItem>
              <MenuItem value="page">
                <FormattedMessage id="page" defaultMessage="Page" />
              </MenuItem>
            </Field>
          </FormControl>
        </Grid>

        {meta.value?.action?.type === 'page' ? (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Field
                fullWidth
                component={Select}
                name={`slides[${index}].action.page`}
                label={<FormattedMessage id="page" defaultMessage="Page" />}
              >
                {allPages.map((page, key) => (
                  <MenuItem key={key} value={page.uri}>
                    {page.page}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="url" defaultMessage="URL" />}
              name={`slides[${index}].action.url`}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Box>
            <Stack spacing={1} alignItems="center" direction="row">
              <Button
                onClick={() => setIsEditing(false)}
                startIcon={<Check />}
                size="small"
                variant="outlined"
                disabled={Boolean(imgMeta.error)}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<Delete />}
                onClick={onRemove}
                size="small"
              >
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar variant="rounded" src={meta.value.imageUrl} />
        {meta.value.title && (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {meta.value.title}
            </Typography>
            {meta.value.subtitle && (
              <Typography variant="body2" color="text.secondary">
                {meta.value.subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Stack
        spacing={0.5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton disabled={disableUp} onClick={onUp}>
          <ArrowUpwardIcon fontSize="inherit" />
        </IconButton>
        <IconButton disabled={disableDown} onClick={onDown}>
          <ArrowDownwardIcon fontSize="inherit" />
        </IconButton>
        <IconButton onClick={() => setIsEditing(true)}>
          <Edit fontSize="inherit" />
        </IconButton>
        <IconButton color="error" onClick={onRemove}>
          <Delete fontSize="inherit" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
