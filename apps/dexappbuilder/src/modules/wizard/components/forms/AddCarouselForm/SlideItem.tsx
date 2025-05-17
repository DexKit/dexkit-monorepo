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
  isMobile?: boolean;
}

export default function SlideItem({
  index,
  disableUp,
  disableDown,
  onRemove,
  onSelectImage,
  onUp,
  onDown,
  isMobile,
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
      <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <Alert severity="info" sx={isMobile ? {
          fontSize: '0.7rem',
          py: 0,
          px: 1,
          mb: 1,
          '& .MuiAlert-icon': { fontSize: '0.9rem', marginRight: '6px' },
          '& .MuiAlert-message': { padding: '4px 0' }
        } : { mb: 1 }}>
          <FormattedMessage
            id="carousel.image.aspectRatio"
            defaultMessage="The image must have a 16/9 aspect ratio to be displayed correctly in the carousel."
          />
        </Alert>

        <Grid container spacing={isMobile ? 0.5 : 1}>
          <Grid item xs={12}>
            <Field
              component={TextField}
              fullWidth
              label={
                <FormattedMessage id="image.url" defaultMessage="Image URL" />
              }
              name={`slides[${index}].imageUrl`}
              InputLabelProps={{
                shrink: true,
                style: isMobile ? {
                  fontSize: '0.8rem'
                } : {}
              }}
              inputProps={{
                style: isMobile ? {
                  fontSize: '0.8rem',
                  padding: '4px 10px 4px 4px'
                } : {}
              }}
              size={isMobile ? "small" : "medium"}
              margin="dense"
              InputProps={{
                shrink: true,
                style: isMobile ? {
                  fontSize: '0.8rem',
                  height: '35px'
                } : {},
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onSelectImage} size={isMobile ? "small" : "medium"} edge="end" sx={isMobile ? { padding: '2px' } : {}}>
                      <Image fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem',
                  padding: '0 4px'
                }
              } : {}}
            />
          </Grid>

          <Grid item xs={6}>
            <Field
              component={TextField}
              fullWidth
              name={`slides[${index}].title`}
              label={<FormattedMessage id="title" defaultMessage="Title" />}
              size={isMobile ? "small" : "medium"}
              margin="dense"
              inputProps={{
                style: isMobile ? {
                  fontSize: '0.8rem',
                  padding: '4px'
                } : {}
              }}
              InputLabelProps={{
                style: isMobile ? {
                  fontSize: '0.8rem'
                } : {}
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem',
                  padding: '0 4px'
                }
              } : {}}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              component={TextField}
              fullWidth
              name={`slides[${index}].subtitle`}
              label={<FormattedMessage id="subtitle" defaultMessage="subtitle" />}
              size={isMobile ? "small" : "medium"}
              margin="dense"
              inputProps={{
                style: isMobile ? {
                  fontSize: '0.8rem',
                  padding: '4px'
                } : {}
              }}
              InputLabelProps={{
                style: isMobile ? {
                  fontSize: '0.8rem'
                } : {}
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem',
                  padding: '0 4px'
                }
              } : {}}
            />
          </Grid>

          <Grid item xs={6}>
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
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem',
                  padding: '0 4px'
                },
                '& input': {
                  fontSize: '0.8rem',
                  padding: '4px'
                },
                '& label': {
                  fontSize: '0.8rem'
                },
                margin: '4px 0'
              } : {}}
            />
          </Grid>
          <Grid item xs={6}>
            <FormikMuiColorInput
              fullWidth
              label={
                <FormattedMessage id="text.color" defaultMessage="Text color" />
              }
              format="rgb"
              name={`slides[${index}].textColor`}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem',
                  padding: '0 4px'
                },
                '& input': {
                  fontSize: '0.8rem',
                  padding: '4px'
                },
                '& label': {
                  fontSize: '0.8rem'
                },
                margin: '4px 0'
              } : {}}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: isMobile ? 0 : 1 }}>
            <Box sx={{ px: 1 }}>
              <Typography variant="caption" sx={isMobile ? { fontSize: '0.7rem' } : {}}>
                <FormattedMessage id="overlay.percentage" defaultMessage="Overlay percentage" />: {perProps.value || 0}%
              </Typography>
              <Slider
                value={perProps.value || 0}
                onChange={(e, value) => {
                  if (!Array.isArray(value)) {
                    perImgHelpers.setValue(value);
                  }
                }}
                size={isMobile ? "small" : "medium"}
                sx={{ padding: '6px 0' }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
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
              size={isMobile ? "small" : "medium"}
              margin="dense"
              inputProps={{
                style: isMobile ? {
                  fontSize: '0.8rem',
                  padding: '4px'
                } : {}
              }}
              InputLabelProps={{
                style: isMobile ? {
                  fontSize: '0.8rem'
                } : {}
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem',
                  padding: '0 4px'
                }
              } : {}}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '0.8rem'
                },
                '& .MuiSelect-select': {
                  padding: '4px 8px',
                  fontSize: '0.8rem'
                }
              } : {}}
            >
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
                size={isMobile ? "small" : "medium"}
                sx={isMobile ? {
                  fontSize: '0.8rem',
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                } : {}}
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

          <Grid item xs={12}>
            {meta.value?.action?.type === 'page' ? (
              <FormControl
                fullWidth
                size={isMobile ? "small" : "medium"}
                sx={isMobile ? {
                  '& .MuiInputBase-root': {
                    height: '35px',
                    fontSize: '0.8rem'
                  },
                  '& .MuiSelect-select': {
                    padding: '4px 8px',
                    fontSize: '0.8rem'
                  }
                } : {}}
              >
                <Field
                  fullWidth
                  component={Select}
                  name={`slides[${index}].action.page`}
                  label={<FormattedMessage id="page" defaultMessage="Page" />}
                  size={isMobile ? "small" : "medium"}
                  sx={isMobile ? {
                    fontSize: '0.8rem',
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                  } : {}}
                >
                  {allPages.map((page, key) => (
                    <MenuItem key={key} value={page.uri}>
                      {page.page}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            ) : (
              <Field
                component={TextField}
                fullWidth
                label={<FormattedMessage id="url" defaultMessage="URL" />}
                name={`slides[${index}].action.url`}
                size={isMobile ? "small" : "medium"}
                margin="dense"
                inputProps={{
                  style: isMobile ? {
                    fontSize: '0.8rem',
                    padding: '4px'
                  } : {}
                }}
                InputLabelProps={{
                  style: isMobile ? {
                    fontSize: '0.8rem'
                  } : {}
                }}
                sx={isMobile ? {
                  '& .MuiInputBase-root': {
                    height: '35px',
                    fontSize: '0.8rem',
                    padding: '0 4px'
                  }
                } : {}}
              />
            )}
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <Stack spacing={1} alignItems="center" direction="row">
              <Button
                onClick={() => setIsEditing(false)}
                startIcon={<Check fontSize={isMobile ? "small" : "medium"} />}
                size="small"
                variant="outlined"
                disabled={Boolean(imgMeta.error)}
                sx={isMobile ? { fontSize: '0.7rem', padding: '2px 8px' } : {}}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<Delete fontSize={isMobile ? "small" : "medium"} />}
                onClick={onRemove}
                size="small"
                sx={isMobile ? { fontSize: '0.7rem', padding: '2px 8px' } : {}}
              >
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack
        spacing={isMobile ? 1 : 2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar
          variant="rounded"
          src={meta.value.imageUrl}
          sx={isMobile ? { width: 28, height: 28 } : {}}
        />
        {meta.value.title && (
          <Box>
            <Typography
              variant={isMobile ? "caption" : "body1"}
              fontWeight="bold"
              sx={isMobile ? { fontSize: '0.8rem' } : {}}
            >
              {meta.value.title}
            </Typography>
            {meta.value.subtitle && (
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
                sx={isMobile ? { fontSize: '0.7rem' } : {}}
              >
                {meta.value.subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Stack
        spacing={isMobile ? 0 : 0.5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton disabled={disableUp} onClick={onUp} size={isMobile ? "small" : "medium"}>
          <ArrowUpwardIcon fontSize="inherit" />
        </IconButton>
        <IconButton disabled={disableDown} onClick={onDown} size={isMobile ? "small" : "medium"}>
          <ArrowDownwardIcon fontSize="inherit" />
        </IconButton>
        <IconButton onClick={() => setIsEditing(true)} size={isMobile ? "small" : "medium"}>
          <Edit fontSize="inherit" />
        </IconButton>
        <IconButton color="error" onClick={onRemove} size={isMobile ? "small" : "medium"}>
          <Delete fontSize="inherit" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
