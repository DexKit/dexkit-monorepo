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
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { CORE_PAGES } from '@/modules/wizard/constants';
import { useIsMobile } from '@dexkit/core';
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
  const isMobileHook = useIsMobile();
  const [showDirectionField, setShowDirectionField] = useState(false);

  const [props, meta, helpers] = useField<CarouselSlide>(`slides[${index}]`);

  const [imgProps, imgMeta, imgHelpers] = useField<string>(
    `slides[${index}].imageUrl`,
  );

  const [perProps, perMeta, perImgHelpers] = useField<number>(
    `slides[${index}].overlayPercentage`,
  );

  const [effectProps, effectMeta, effectHelpers] = useField<string>(
    `slides[${index}].visualEffect`,
  );

  const [effectIntensityProps, effectIntensityMeta, effectIntensityHelpers] = useField<string>(
    `slides[${index}].effectIntensity`,
  );

  const [effectSpeedProps, effectSpeedMeta, effectSpeedHelpers] = useField<string>(
    `slides[${index}].effectSpeed`,
  );

  const [effectDirectionProps, effectDirectionMeta, effectDirectionHelpers] = useField<string>(
    `slides[${index}].effectDirection`,
  );

  useEffect(() => {
    const directionalEffects = ['slide', 'shake'];
    setShowDirectionField(directionalEffects.includes(effectProps.value || 'none'));
  }, [effectProps.value]);

  const handleVisualEffectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEffect = event.target.value;
    effectHelpers.setValue(newEffect);

    const directionalEffects = ['slide', 'shake'];
    if (!directionalEffects.includes(newEffect)) {
      effectDirectionHelpers.setValue('horizontal');
    }
  };

  const allPages = useMemo(() => {
    return Object.keys(CORE_PAGES).map((key) => ({
      page: key,
      uri: CORE_PAGES[key].uri,
    }));
  }, []);

  if (isEditing) {
    return (
      <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <Alert severity="info" sx={isMobileHook ? {
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

        <Grid container spacing={isMobileHook ? theme.spacing(0.5) : theme.spacing(1)}>
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
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              inputProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize,
                  padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)} ${theme.spacing(0.5)} ${theme.spacing(0.5)}`
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              InputProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize,
                  height: theme.spacing(4.375)
                } : {},
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onSelectImage} size={isMobileHook ? "small" : "medium"} edge="end" sx={isMobileHook ? { padding: theme.spacing(0.25) } : {}}>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image fontSize={isMobileHook ? "small" : "medium"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={isMobileHook ? {
                '& .MuiInputBase-root': {
                  height: theme.spacing(4.375),
                  fontSize: theme.typography.caption.fontSize,
                  padding: `0 ${theme.spacing(0.5)}`
                }
              } : {}}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              fullWidth
              select
              label={
                <FormattedMessage id="image.scaling" defaultMessage="Image Scaling" />
              }
              name={`slides[${index}].imageScaling`}
              defaultValue="cover"
              InputLabelProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              helperText={
                <FormattedMessage
                  id="image.scaling.help"
                  defaultMessage="Choose how the image should be scaled and displayed"
                />
              }
            >
              <MenuItem value="cover">
                <FormattedMessage id="scaling.cover" defaultMessage="Cover (Fill container)" />
              </MenuItem>
              <MenuItem value="contain">
                <FormattedMessage id="scaling.contain" defaultMessage="Contain (Fit in container)" />
              </MenuItem>
              <MenuItem value="fill">
                <FormattedMessage id="scaling.fill" defaultMessage="Fill (Stretch)" />
              </MenuItem>
              <MenuItem value="center">
                <FormattedMessage id="scaling.center" defaultMessage="Center (No scaling)" />
              </MenuItem>
              <MenuItem value="mosaic">
                <FormattedMessage id="scaling.mosaic" defaultMessage="Mosaic (Pattern)" />
              </MenuItem>
              <MenuItem value="expanded">
                <FormattedMessage id="scaling.expanded" defaultMessage="Expanded (Zoom)" />
              </MenuItem>
            </Field>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              fullWidth
              select
              label={
                <FormattedMessage id="image.position" defaultMessage="Image Position" />
              }
              name={`slides[${index}].imagePosition`}
              defaultValue="center"
              InputLabelProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              helperText={
                <FormattedMessage
                  id="image.position.help"
                  defaultMessage="Choose where the image should be positioned within the container"
                />
              }
            >
              <MenuItem value="center">
                <FormattedMessage id="position.center" defaultMessage="Center" />
              </MenuItem>
              <MenuItem value="top">
                <FormattedMessage id="position.top" defaultMessage="Top" />
              </MenuItem>
              <MenuItem value="bottom">
                <FormattedMessage id="position.bottom" defaultMessage="Bottom" />
              </MenuItem>
              <MenuItem value="left">
                <FormattedMessage id="position.left" defaultMessage="Left" />
              </MenuItem>
              <MenuItem value="right">
                <FormattedMessage id="position.right" defaultMessage="Right" />
              </MenuItem>
              <MenuItem value="top-left">
                <FormattedMessage id="position.top-left" defaultMessage="Top Left" />
              </MenuItem>
              <MenuItem value="top-right">
                <FormattedMessage id="position.top-right" defaultMessage="Top Right" />
              </MenuItem>
              <MenuItem value="bottom-left">
                <FormattedMessage id="position.bottom-left" defaultMessage="Bottom Left" />
              </MenuItem>
              <MenuItem value="bottom-right">
                <FormattedMessage id="position.bottom-right" defaultMessage="Bottom Right" />
              </MenuItem>
            </Field>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              <FormattedMessage id="visual.effects" defaultMessage="Visual Effects" />
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              fullWidth
              select
              label={
                <FormattedMessage id="visual.effect" defaultMessage="Visual Effect" />
              }
              name={`slides[${index}].visualEffect`}
              defaultValue="none"
              InputLabelProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              helperText={
                <FormattedMessage
                  id="visual.effect.help"
                  defaultMessage="Choose a visual effect to apply to the image"
                />
              }
              onChange={handleVisualEffectChange}
            >
              <MenuItem value="none">
                <FormattedMessage id="effect.none" defaultMessage="None" />
              </MenuItem>
              <MenuItem value="pulse">
                <FormattedMessage id="effect.pulse" defaultMessage="Pulse" />
              </MenuItem>
              <MenuItem value="float">
                <FormattedMessage id="effect.float" defaultMessage="Float" />
              </MenuItem>
              <MenuItem value="zoom">
                <FormattedMessage id="effect.zoom" defaultMessage="Zoom" />
              </MenuItem>
              <MenuItem value="slide">
                <FormattedMessage id="effect.slide" defaultMessage="Slide" />
              </MenuItem>
              <MenuItem value="rotate">
                <FormattedMessage id="effect.rotate" defaultMessage="Rotate" />
              </MenuItem>
              <MenuItem value="shake">
                <FormattedMessage id="effect.shake" defaultMessage="Shake" />
              </MenuItem>
              <MenuItem value="glow">
                <FormattedMessage id="effect.glow" defaultMessage="Glow" />
              </MenuItem>
            </Field>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              fullWidth
              select
              label={
                <FormattedMessage id="effect.intensity" defaultMessage="Effect Intensity" />
              }
              name={`slides[${index}].effectIntensity`}
              defaultValue="medium"
              InputLabelProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              helperText={
                <FormattedMessage
                  id="effect.intensity.help"
                  defaultMessage="Set the intensity of the visual effect"
                />
              }
            >
              <MenuItem value="low">
                <FormattedMessage id="intensity.low" defaultMessage="Low" />
              </MenuItem>
              <MenuItem value="medium">
                <FormattedMessage id="intensity.medium" defaultMessage="Medium" />
              </MenuItem>
              <MenuItem value="high">
                <FormattedMessage id="intensity.high" defaultMessage="High" />
              </MenuItem>
            </Field>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              fullWidth
              select
              label={
                <FormattedMessage id="effect.speed" defaultMessage="Effect Speed" />
              }
              name={`slides[${index}].effectSpeed`}
              defaultValue="normal"
              InputLabelProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              helperText={
                <FormattedMessage
                  id="effect.speed.help"
                  defaultMessage="Set the speed of the visual effect"
                />
              }
            >
              <MenuItem value="slow">
                <FormattedMessage id="speed.slow" defaultMessage="Slow" />
              </MenuItem>
              <MenuItem value="normal">
                <FormattedMessage id="speed.normal" defaultMessage="Normal" />
              </MenuItem>
              <MenuItem value="fast">
                <FormattedMessage id="speed.fast" defaultMessage="Fast" />
              </MenuItem>
            </Field>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              fullWidth
              select
              label={
                <FormattedMessage id="effect.direction" defaultMessage="Effect Direction" />
              }
              name={`slides[${index}].effectDirection`}
              defaultValue="horizontal"
              InputLabelProps={{
                shrink: true,
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              helperText={
                <FormattedMessage
                  id="effect.direction.help"
                  defaultMessage="Set the direction of the visual effect"
                />
              }
              sx={{
                display: showDirectionField ? 'block' : 'none'
              }}
            >
              <MenuItem value="horizontal">
                <FormattedMessage id="direction.horizontal" defaultMessage="Horizontal" />
              </MenuItem>
              <MenuItem value="vertical">
                <FormattedMessage id="direction.vertical" defaultMessage="Vertical" />
              </MenuItem>
              <MenuItem value="diagonal">
                <FormattedMessage id="direction.diagonal" defaultMessage="Diagonal" />
              </MenuItem>
              <MenuItem value="radial">
                <FormattedMessage id="direction.radial" defaultMessage="Radial" />
              </MenuItem>
            </Field>
          </Grid>

          {/* Image Preview */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <FormattedMessage id="image.preview" defaultMessage="Image Preview" />
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  bgcolor: 'background.paper',
                }}
              >
                {imgProps.value && (
                  <Box
                    sx={{
                      backgroundImage: `url("${imgProps.value}")`,
                      backgroundSize: (() => {
                        const scaling = props.value.imageScaling || 'cover';
                        switch (scaling) {
                          case 'cover': return 'cover';
                          case 'contain': return 'contain';
                          case 'fill': return '100% 100%';
                          case 'center': return 'auto';
                          case 'mosaic': return '50px 50px';
                          case 'expanded': return '120%';
                          default: return 'cover';
                        }
                      })(),
                      backgroundPosition: (() => {
                        const position = props.value.imagePosition || 'center';
                        switch (position) {
                          case 'center': return 'center center';
                          case 'top': return 'center top';
                          case 'bottom': return 'center bottom';
                          case 'left': return 'left center';
                          case 'right': return 'right center';
                          case 'top-left': return 'left top';
                          case 'top-right': return 'right top';
                          case 'bottom-left': return 'left bottom';
                          case 'bottom-right': return 'right bottom';
                          default: return 'center center';
                        }
                      })(),
                      backgroundRepeat: props.value.imageScaling === 'mosaic' ? 'repeat' : 'no-repeat',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
                {!imgProps.value && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: 'text.secondary',
                    }}
                  >
                    <FormattedMessage id="no.image.selected" defaultMessage="No image selected" />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Field
              component={TextField}
              fullWidth
              name={`slides[${index}].title`}
              label={<FormattedMessage id="title" defaultMessage="Title" />}
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              inputProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                } : {}
              }}
              InputLabelProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              sx={isMobileHook ? {
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
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              inputProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                } : {}
              }}
              InputLabelProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              sx={isMobileHook ? {
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
              sx={isMobileHook ? {
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
              sx={isMobileHook ? {
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

          <Grid item xs={12} sx={{ mt: isMobileHook ? 0 : 1 }}>
            <Box sx={{ px: theme.spacing(1) }}>
              <Typography variant="caption" sx={isMobileHook ? { fontSize: theme.typography.caption.fontSize } : {}}>
                <FormattedMessage id="overlay.percentage" defaultMessage="Overlay percentage" />: {perProps.value || 0}%
              </Typography>
              <Slider
                value={perProps.value || 0}
                onChange={(e, value) => {
                  if (!Array.isArray(value)) {
                    perImgHelpers.setValue(value);
                  }
                }}
                size={isMobileHook ? "small" : "medium"}
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
              size={isMobileHook ? "small" : "medium"}
              margin="dense"
              inputProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0.5)
                } : {}
              }}
              InputLabelProps={{
                style: isMobileHook ? {
                  fontSize: theme.typography.caption.fontSize
                } : {}
              }}
              sx={isMobileHook ? {
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
              size={isMobileHook ? "small" : "medium"}
              sx={isMobileHook ? {
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
                size={isMobileHook ? "small" : "medium"}
                sx={isMobileHook ? {
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
                size={isMobileHook ? "small" : "medium"}
                sx={isMobileHook ? {
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
                  size={isMobileHook ? "small" : "medium"}
                  sx={isMobileHook ? {
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
                size={isMobileHook ? "small" : "medium"}
                margin="dense"
                inputProps={{
                  style: isMobileHook ? {
                    fontSize: theme.typography.caption.fontSize,
                    padding: theme.spacing(0.5)
                  } : {}
                }}
                InputLabelProps={{
                  style: isMobileHook ? {
                    fontSize: theme.typography.caption.fontSize
                  } : {}
                }}
                sx={isMobileHook ? {
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
                startIcon={<Check fontSize={isMobileHook ? "small" : "medium"} />}
                size="small"
                variant="outlined"
                disabled={Boolean(imgMeta.error)}
                sx={isMobileHook ? { fontSize: theme.typography.caption.fontSize, padding: `${theme.spacing(0.25)} ${theme.spacing(1)}` } : {}}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={<Delete fontSize={isMobileHook ? "small" : "medium"} />}
                onClick={onRemove}
                size="small"
                sx={isMobileHook ? { fontSize: theme.typography.caption.fontSize, padding: `${theme.spacing(0.25)} ${theme.spacing(1)}` } : {}}
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
        spacing={isMobileHook ? theme.spacing(1) : theme.spacing(2)}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar
          variant="rounded"
          src={meta.value.imageUrl}
          sx={isMobileHook ? { width: theme.spacing(3.5), height: theme.spacing(3.5) } : {}}
        />
        {meta.value.title && (
          <Box>
            <Typography
              variant={isMobileHook ? "caption" : "body1"}
              fontWeight="bold"
              sx={isMobileHook ? { fontSize: theme.typography.body2.fontSize } : {}}
            >
              {meta.value.title}
            </Typography>
            {meta.value.subtitle && (
              <Typography
                variant={isMobileHook ? "caption" : "body2"}
                color="text.secondary"
                sx={isMobileHook ? { fontSize: theme.typography.caption.fontSize } : {}}
              >
                {meta.value.subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Stack
        spacing={isMobileHook ? 0 : theme.spacing(0.5)}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton disabled={disableUp} onClick={onUp} size={isMobileHook ? "small" : "medium"}>
          <ArrowUpwardIcon fontSize="inherit" />
        </IconButton>
        <IconButton disabled={disableDown} onClick={onDown} size={isMobileHook ? "small" : "medium"}>
          <ArrowDownwardIcon fontSize="inherit" />
        </IconButton>
        <IconButton onClick={() => setIsEditing(true)} size={isMobileHook ? "small" : "medium"}>
          <Edit fontSize="inherit" />
        </IconButton>
        <IconButton color="error" onClick={onRemove} size={isMobileHook ? "small" : "medium"}>
          <Delete fontSize="inherit" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
