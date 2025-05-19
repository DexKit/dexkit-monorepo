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
  useTheme,
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
  const theme = useTheme();

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
          fontSize: theme.typography.caption.fontSize,
          py: 0,
          px: theme.spacing(1),
          mb: theme.spacing(1),
          '& .MuiAlert-icon': { fontSize: theme.typography.caption.fontSize, marginRight: theme.spacing(0.75) },
          '& .MuiAlert-message': { padding: theme.spacing(0.5, 0) }
        } : { mb: theme.spacing(1) }}>
          <FormattedMessage
            id="carousel.image.aspectRatio"
            defaultMessage="The image must have a 16/9 aspect ratio to be displayed correctly in the carousel."
          />
        </Alert>

        <Grid container spacing={isMobile ? theme.spacing(0.5) : theme.spacing(1)}>
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
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              inputProps={{
                style: isMobile ? {
                  fontSize: theme.typography.caption.fontSize,
                  padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)} ${theme.spacing(0.5)} ${theme.spacing(0.5)}`
                } : {}
              }}
              size={isMobile ? "small" : "medium"}
              margin="dense"
              InputProps={{
                shrink: true,
                style: isMobile ? {
                  fontSize: theme.typography.caption.fontSize,
                  height: theme.spacing(4.375)
                } : {},
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onSelectImage} size={isMobile ? "small" : "medium"} edge="end" sx={isMobile ? { padding: theme.spacing(0.25) } : {}}>
                      <Image fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
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
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                } : {}
              }}
              InputLabelProps={{
                style: isMobile ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
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
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                } : {}
              }}
              InputLabelProps={{
                style: isMobile ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
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
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
                },
                '& input': {
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                },
                '& label': {
                  fontSize: theme.typography.caption.fontSize
                },
                margin: `${theme.spacing(0.5)} 0`
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
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
                },
                '& input': {
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                },
                '& label': {
                  fontSize: theme.typography.caption.fontSize
                },
                margin: `${theme.spacing(0.5)} 0`
              } : {}}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: isMobile ? 0 : 1 }}>
            <Box sx={{ px: theme.spacing(1) }}>
              <Typography variant="caption" sx={isMobile ? { fontSize: theme.typography.caption.fontSize } : {}}>
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
                sx={{ padding: `${theme.spacing(0.75)} 0` }}
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
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                } : {}
              }}
              InputLabelProps={{
                style: isMobile ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              sx={isMobile ? {
                '& .MuiInputBase-root': {
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
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
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize
                },
                '& .MuiSelect-select': {
                  padding: theme.spacing(0.5),
                  fontSize: theme.typography.caption.fontSize
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
                  fontSize: theme.typography.caption.fontSize,
                  '& .MuiInputLabel-root': { fontSize: theme.typography.caption.fontSize }
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
                    height: theme.spacing(4.375),
                    fontSize: theme.typography.caption.fontSize
                  },
                  '& .MuiSelect-select': {
                    padding: theme.spacing(0.5),
                    fontSize: theme.typography.caption.fontSize
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
                    fontSize: theme.typography.caption.fontSize,
                    '& .MuiInputLabel-root': { fontSize: theme.typography.caption.fontSize }
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
                    fontSize: theme.typography.caption.fontSize,
                    padding: theme.spacing(0.5)
                  } : {}
                }}
                InputLabelProps={{
                  style: isMobile ? {
                    fontSize: theme.typography.caption.fontSize
                  } : {}
                }}
                sx={isMobile ? {
                  '& .MuiInputBase-root': {
                    height: theme.spacing(4.375),
                    fontSize: theme.typography.caption.fontSize,
                    padding: `0 ${theme.spacing(0.5)}`
                  }
                } : {}}
              />
            )}
          </Grid>

          <Grid item xs={12} sx={{ mt: theme.spacing(1) }}>
            <Stack spacing={theme.spacing(1)} alignItems="center" direction="row">
              <Button
                onClick={() => setIsEditing(false)}
                startIcon={<Check fontSize={isMobile ? "small" : "medium"} />}
                size="small"
                variant="outlined"
                disabled={Boolean(imgMeta.error)}
                sx={isMobile ? { fontSize: theme.typography.caption.fontSize, padding: `${theme.spacing(0.25)} ${theme.spacing(1)}` } : {}}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<Delete fontSize={isMobile ? "small" : "medium"} />}
                onClick={onRemove}
                size="small"
                sx={isMobile ? { fontSize: theme.typography.caption.fontSize, padding: `${theme.spacing(0.25)} ${theme.spacing(1)}` } : {}}
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
        spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar
          variant="rounded"
          src={meta.value.imageUrl}
          sx={isMobile ? { width: theme.spacing(3.5), height: theme.spacing(3.5) } : {}}
        />
        {meta.value.title && (
          <Box>
            <Typography
              variant={isMobile ? "caption" : "body1"}
              fontWeight="bold"
              sx={isMobile ? { fontSize: theme.typography.body2.fontSize } : {}}
            >
              {meta.value.title}
            </Typography>
            {meta.value.subtitle && (
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
                sx={isMobile ? { fontSize: theme.typography.caption.fontSize } : {}}
              >
                {meta.value.subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Stack
        spacing={isMobile ? 0 : theme.spacing(0.5)}
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
