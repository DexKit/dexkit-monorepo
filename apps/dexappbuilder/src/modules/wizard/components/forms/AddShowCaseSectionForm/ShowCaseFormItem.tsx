import { ipfsUriToUrl } from '@dexkit/core/utils';
import { ShowCaseItem } from '@dexkit/ui/modules/wizard/types/section';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Check from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Image from '@mui/icons-material/Image';

import { CORE_PAGES, CUSTOM_PAGE_KEY } from '@/modules/wizard/constants';
import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { Network } from '@dexkit/core/types';
import { getNetworks } from '@dexkit/core/utils/blockchain';
import { useActiveChainIds, useAppWizardConfig } from '@dexkit/ui';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  Paper,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { Field, useField } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AssetItem from './AssetItem';
import CollectionItem from './CollectionItem';

export interface ShowCaseFormItemProps {
  index: number;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  onSelectImage: () => void;
  isMobile?: boolean;
}

export default function ShowCaseFormItem({
  index,
  onRemove,
  onUp,
  onDown,
  disableUp,
  disableDown,
  onSelectImage,
  isMobile,
}: ShowCaseFormItemProps) {
  const { wizardConfig } = useAppWizardConfig();
  const theme = useTheme();

  const { activeChainIds } = useActiveChainIds();

  const [itemProps, itemMeta, itemHelpers] = useField<ShowCaseItem>(
    `items[${index}]`,
  );

  const [pageProps, pageMeta, pageHelpers] = useField<string>(
    `items[${index}].page`,
  );

  const [isEditing, setIsEditing] = useState(false);

  const [auxPage, setAuxPage] = useState(pageProps.value);

  const [imgProps, imgMeta, imgHelpers] = useField<string>(
    `items[${index}].image`,
  );

  const pages = wizardConfig.pages;

  const appPagesData = useMemo(() => {
    return { ...pages, ...CORE_PAGES };
  }, [pages]);

  const appPagesUri = useMemo(() => {
    return (
      Object.keys(appPagesData).map((key) => appPagesData[key].uri as string) ||
      []
    );
  }, [appPagesData]);

  const isCustomPage = useMemo(() => {
    if (appPagesUri && auxPage) {
      return !appPagesUri.includes(auxPage);
    }
  }, [appPagesUri, auxPage]);

  const allPages = useMemo(() => {
    if (isCustomPage) {
      return Object.keys(appPagesData)
        .map((key) => ({
          page: key,
          title: appPagesData[key]?.title,
          uri: appPagesData[key].uri,
        }))
        .concat({
          page: CUSTOM_PAGE_KEY,
          title: 'Custom',
          uri: auxPage,
        });
    } else {
      return Object.keys(appPagesData)
        .map((key) => ({
          page: key,
          title: appPagesData[key]?.title,
          uri: appPagesData[key].uri,
        }))
        .concat({
          page: CUSTOM_PAGE_KEY,
          title: 'Custom',
          uri: `/${CUSTOM_PAGE_KEY}`,
        });
    }
  }, [appPagesData, isCustomPage, auxPage]);

  const handleChangePage = (event: SelectChangeEvent<unknown>) => {
    pageHelpers.setValue(event.target.value as string);
    setAuxPage(event.target.value as string);
  };

  if (isEditing) {
    return (
      <Paper
        sx={(theme) => ({
          borderColor: itemMeta.error ? theme.palette.error.main : undefined,
          p: theme.spacing(2),
        })}
      >
        {imgMeta.error}
        <Grid container spacing={theme.spacing(2)}>
          <Grid size={12}>
            <FormControl fullWidth>
              <Field
                fullWidth
                label={
                  <FormattedMessage id="item.type" defaultMessage="Item type" />
                }
                component={Select}
                name={`items[${index}].type`}
              >
                <MenuItem value="image">
                  <FormattedMessage id="image" defaultMessage="Image" />
                </MenuItem>
                <MenuItem value="asset">
                  <FormattedMessage id="asset" defaultMessage="Asset" />
                </MenuItem>
                <MenuItem value="collection">
                  <FormattedMessage
                    id="collection"
                    defaultMessage="Collection"
                  />
                </MenuItem>
              </Field>
            </FormControl>
          </Grid>
          {itemMeta.value.type === 'image' && (
            <Grid size={12}>
              <Grid container spacing={theme.spacing(2)}>
                <Grid size={12}>
                  <Field
                    fullWidth
                    component={TextField}
                    name={`items[${index}].imageUrl`}
                    label={
                      <FormattedMessage
                        id="image.url"
                        defaultMessage="Image URL"
                      />
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      shrink: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={onSelectImage}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    fullWidth
                    component={TextField}
                    name={`items[${index}].title`}
                    label={
                      <FormattedMessage id="title" defaultMessage="Title" />
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    fullWidth
                    component={TextField}
                    name={`items[${index}].subtitle`}
                    label={
                      <FormattedMessage
                        id="subtitle"
                        defaultMessage="Subtitle"
                      />
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth>
                    <Field
                      fullWidth
                      component={Select}
                      name={`items[${index}].actionType`}
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
                {itemMeta.value?.actionType === 'page' ? (
                  <>
                    <Grid size={12}>
                      <FormControl fullWidth>
                        <MuiSelect value={auxPage} onChange={handleChangePage}>
                          {allPages.map((page: any, key: any) => (
                            <MenuItem key={key} value={page.uri}>
                              {page.title || ' '}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </Grid>
                    <Grid size={12}>
                      {isCustomPage && (
                        <Field
                          component={TextField}
                          fullWidth
                          label={
                            <FormattedMessage id="uri" defaultMessage="URI" />
                          }
                          name={`items[${index}].page`}
                        />
                      )}
                    </Grid>
                  </>
                ) : (
                  <Grid size={12}>
                    <Field
                      component={TextField}
                      fullWidth
                      label={<FormattedMessage id="url" defaultMessage="URL" />}
                      name={`items[${index}].url`}
                    />
                  </Grid>
                )}

                <Grid size={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    <FormattedMessage id="custom.styling" defaultMessage="Custom Styling" />
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].customImageScaling`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="custom.image.scaling"
                          defaultMessage="Custom Image Scaling"
                        />
                      }
                    >
                      <MenuItem value="cover">
                        <FormattedMessage id="scaling.cover" defaultMessage="Cover" />
                      </MenuItem>
                      <MenuItem value="contain">
                        <FormattedMessage id="scaling.contain" defaultMessage="Contain" />
                      </MenuItem>
                      <MenuItem value="fill">
                        <FormattedMessage id="scaling.fill" defaultMessage="Fill" />
                      </MenuItem>
                      <MenuItem value="center">
                        <FormattedMessage id="scaling.center" defaultMessage="Center" />
                      </MenuItem>
                      <MenuItem value="mosaic">
                        <FormattedMessage id="scaling.mosaic" defaultMessage="Mosaic" />
                      </MenuItem>
                      <MenuItem value="expanded">
                        <FormattedMessage id="scaling.expanded" defaultMessage="Expanded" />
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].customImagePosition`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="custom.image.position"
                          defaultMessage="Custom Image Position"
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
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].customHoverEffect`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="custom.hover.effect"
                          defaultMessage="Custom Hover Effect"
                        />
                      }
                    >
                      <MenuItem value="none">
                        <FormattedMessage id="effect.none" defaultMessage="None" />
                      </MenuItem>
                      <MenuItem value="zoom">
                        <FormattedMessage id="effect.zoom" defaultMessage="Zoom" />
                      </MenuItem>
                      <MenuItem value="lift">
                        <FormattedMessage id="effect.lift" defaultMessage="Lift" />
                      </MenuItem>
                      <MenuItem value="glow">
                        <FormattedMessage id="effect.glow" defaultMessage="Glow" />
                      </MenuItem>
                      <MenuItem value="fade">
                        <FormattedMessage id="effect.fade" defaultMessage="Fade" />
                      </MenuItem>
                      <MenuItem value="slide">
                        <FormattedMessage id="effect.slide" defaultMessage="Slide" />
                      </MenuItem>
                      <MenuItem value="rotate">
                        <FormattedMessage id="effect.rotate" defaultMessage="Rotate" />
                      </MenuItem>
                      <MenuItem value="scale">
                        <FormattedMessage id="effect.scale" defaultMessage="Scale" />
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].customCardStyle`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="custom.card.style"
                          defaultMessage="Custom Card Style"
                        />
                      }
                    >
                      <MenuItem value="default">
                        <FormattedMessage id="style.default" defaultMessage="Default" />
                      </MenuItem>
                      <MenuItem value="minimal">
                        <FormattedMessage id="style.minimal" defaultMessage="Minimal" />
                      </MenuItem>
                      <MenuItem value="elevated">
                        <FormattedMessage id="style.elevated" defaultMessage="Elevated" />
                      </MenuItem>
                      <MenuItem value="bordered">
                        <FormattedMessage id="style.bordered" defaultMessage="Bordered" />
                      </MenuItem>
                      <MenuItem value="glassmorphism">
                        <FormattedMessage id="style.glassmorphism" defaultMessage="Glassmorphism" />
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Box sx={{ px: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <FormattedMessage
                        id="custom.border.radius"
                        defaultMessage="Custom Border Radius"
                      />
                    </Typography>
                    <Field
                      component={Slider}
                      name={`items[${index}].customBorderRadius`}
                      value={itemProps.value.type === 'image' ? (itemProps.value.customBorderRadius || 0) : 0}
                      onChange={(_: Event, newValue: number | number[]) => {
                        if (itemProps.value.type === 'image') {
                          itemHelpers.setValue({
                            ...itemProps.value,
                            customBorderRadius: newValue as number
                          });
                        }
                      }}
                      min={0}
                      max={10}
                      step={0.5}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 2, label: '2' },
                        { value: 4, label: '4' },
                        { value: 6, label: '6' },
                        { value: 8, label: '8' },
                        { value: 10, label: '10' }
                      ]}
                      valueLabelDisplay="auto"
                      disabled={itemProps.value.type !== 'image'}
                      sx={{
                        '& .MuiSlider-track': {
                          backgroundColor: theme.palette.primary.main,
                        },
                        '& .MuiSlider-thumb': {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].customShadowIntensity`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="custom.shadow.intensity"
                          defaultMessage="Custom Shadow Intensity"
                        />
                      }
                    >
                      <MenuItem value="none">
                        <FormattedMessage id="intensity.none" defaultMessage="None" />
                      </MenuItem>
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
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Box sx={{ px: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <FormattedMessage
                        id="custom.overlay.color"
                        defaultMessage="Custom Overlay Color"
                      />
                    </Typography>
                    <Field
                      component="input"
                      type="color"
                      name={`items[${index}].customOverlayColor`}
                      sx={{
                        width: 56,
                        height: 56,
                        border: '2px solid rgba(255, 255, 255, 0.23)',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&::-webkit-color-swatch-wrapper': { padding: 0 },
                        '&::-webkit-color-swatch': { border: 'none', borderRadius: 0.5 },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Box sx={{ px: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <FormattedMessage
                        id="custom.overlay.opacity"
                        defaultMessage="Custom Overlay Opacity"
                      />
                    </Typography>
                    <Field
                      component={Slider}
                      name={`items[${index}].customOverlayOpacity`}
                      value={itemProps.value.type === 'image' ? (itemProps.value.customOverlayOpacity || 0) : 0}
                      onChange={(_: Event, newValue: number | number[]) => {
                        if (itemProps.value.type === 'image') {
                          itemHelpers.setValue({
                            ...itemProps.value,
                            customOverlayOpacity: newValue as number
                          });
                        }
                      }}
                      min={0}
                      max={1}
                      step={0.1}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 0.2, label: '0.2' },
                        { value: 0.4, label: '0.4' },
                        { value: 0.6, label: '0.6' },
                        { value: 0.8, label: '0.8' },
                        { value: 1, label: '1' }
                      ]}
                      valueLabelDisplay="auto"
                      disabled={itemProps.value.type !== 'image'}
                      sx={{
                        '& .MuiSlider-track': {
                          backgroundColor: theme.palette.primary.main,
                        },
                        '& .MuiSlider-thumb': {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].customOverlayStyle`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="custom.overlay.style"
                          defaultMessage="Custom Overlay Style"
                        />
                      }
                      disabled={itemProps.value.type !== 'image'}
                    >
                      <MenuItem value="linear-top">
                        <FormattedMessage id="overlay.linear.top" defaultMessage="Linear Top" />
                      </MenuItem>
                      <MenuItem value="linear-bottom">
                        <FormattedMessage id="overlay.linear.bottom" defaultMessage="Linear Bottom" />
                      </MenuItem>
                      <MenuItem value="linear-left">
                        <FormattedMessage id="overlay.linear.left" defaultMessage="Linear Left" />
                      </MenuItem>
                      <MenuItem value="linear-right">
                        <FormattedMessage id="overlay.linear.right" defaultMessage="Linear Right" />
                      </MenuItem>
                      <MenuItem value="linear-top-left">
                        <FormattedMessage id="overlay.linear.top.left" defaultMessage="Linear Top-Left" />
                      </MenuItem>
                      <MenuItem value="linear-top-right">
                        <FormattedMessage id="overlay.linear.top.right" defaultMessage="Linear Top-Right" />
                      </MenuItem>
                      <MenuItem value="linear-bottom-left">
                        <FormattedMessage id="overlay.linear.bottom.left" defaultMessage="Linear Bottom-Left" />
                      </MenuItem>
                      <MenuItem value="linear-bottom-right">
                        <FormattedMessage id="overlay.linear.bottom.right" defaultMessage="Linear Bottom-Right" />
                      </MenuItem>
                      <MenuItem value="radial-center">
                        <FormattedMessage id="overlay.radial.center" defaultMessage="Radial Center" />
                      </MenuItem>
                      <MenuItem value="radial-top">
                        <FormattedMessage id="overlay.radial.top" defaultMessage="Radial Top" />
                      </MenuItem>
                      <MenuItem value="radial-bottom">
                        <FormattedMessage id="overlay.radial.bottom" defaultMessage="Radial Bottom" />
                      </MenuItem>
                      <MenuItem value="radial-left">
                        <FormattedMessage id="overlay.radial.left" defaultMessage="Radial Left" />
                      </MenuItem>
                      <MenuItem value="radial-right">
                        <FormattedMessage id="overlay.radial.right" defaultMessage="Radial Right" />
                      </MenuItem>
                      <MenuItem value="radial-top-left">
                        <FormattedMessage id="overlay.radial.top.left" defaultMessage="Radial Top-Left" />
                      </MenuItem>
                      <MenuItem value="radial-top-right">
                        <FormattedMessage id="overlay.radial.top.right" defaultMessage="Radial Top-Right" />
                      </MenuItem>
                      <MenuItem value="radial-bottom-left">
                        <FormattedMessage id="overlay.radial.bottom.left" defaultMessage="Radial Bottom-Left" />
                      </MenuItem>
                      <MenuItem value="radial-bottom-right">
                        <FormattedMessage id="overlay.radial.bottom.right" defaultMessage="Radial Bottom-Right" />
                      </MenuItem>
                      <MenuItem value="uniform">
                        <FormattedMessage id="overlay.uniform" defaultMessage="Uniform" />
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Box sx={{ px: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <FormattedMessage
                        id="show.text.below"
                        defaultMessage="Show Text Below Image"
                      />
                    </Typography>
                    <Switch
                      checked={itemProps.value.type === 'image' ? (itemProps.value.showTextBelow !== false) : false}
                      onChange={(event: any) => {
                        if (itemProps.value.type === 'image') {
                          itemHelpers.setValue({
                            ...itemProps.value,
                            showTextBelow: event.target.checked
                          });
                        }
                      }}
                      disabled={itemProps.value.type !== 'image'}
                    />
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name={`items[${index}].priority`}
                      fullWidth
                      label={
                        <FormattedMessage
                          id="priority"
                          defaultMessage="Priority"
                        />
                      }
                    >
                      <MenuItem value="low">
                        <FormattedMessage id="priority.low" defaultMessage="Low" />
                      </MenuItem>
                      <MenuItem value="normal">
                        <FormattedMessage id="priority.normal" defaultMessage="Normal" />
                      </MenuItem>
                      <MenuItem value="high">
                        <FormattedMessage id="priority.high" defaultMessage="High" />
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          )}
          {itemMeta.value.type === 'asset' && (
            <Grid size={12}>
              <Grid container spacing={theme.spacing(2)}>
                <Grid size={12}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      fullWidth
                      name={`items[${index}].chainId`}
                      renderValue={(value: ChainId) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={theme.spacing(1)}
                          >
                            <Avatar
                              src={ipfsUriToUrl(
                                NETWORKS[value]?.imageUrl || '',
                              )}
                              style={{ width: 'auto', height: theme.spacing(2) }}
                            />
                            <Typography variant="body1">
                              {NETWORKS[value]?.name}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      {getNetworks({ includeTestnet: true })
                        .filter((n) => activeChainIds.includes(n.chainId))
                        .map((network: Network, index: number) => (
                          <MenuItem key={index} value={network?.chainId}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: theme.spacing(4),
                                  display: 'flex',
                                  alignItems: 'center',
                                  alignContent: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Avatar
                                  src={ipfsUriToUrl(network?.imageUrl || '')}
                                  sx={{
                                    width: 'auto',
                                    height: theme.spacing(2),
                                  }}
                                />
                              </Box>
                            </ListItemIcon>
                            <ListItemText primary={network?.name} />
                          </MenuItem>
                        ))}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    label={
                      <FormattedMessage
                        id="contract.address"
                        defaultMessage="Contract Address"
                      />
                    }
                    name={`items[${index}].contractAddress`}
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    label={
                      <FormattedMessage
                        id="token.id"
                        defaultMessage="TokenID"
                      />
                    }
                    name={`items[${index}].tokenId`}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          {itemMeta.value.type === 'collection' && (
            <Grid size={12}>
              <Grid container spacing={theme.spacing(2)}>
                <Grid size={12}>
                  <Field
                    fullWidth
                    component={TextField}
                    name={`items[${index}].imageUrl`}
                    label={
                      <FormattedMessage
                        id="image.url"
                        defaultMessage="Image URL"
                      />
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      shrink: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={onSelectImage}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    fullWidth
                    component={TextField}
                    name={`items[${index}].title`}
                    label={
                      <FormattedMessage id="title" defaultMessage="Title" />
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    fullWidth
                    component={TextField}
                    name={`items[${index}].subtitle`}
                    label={
                      <FormattedMessage
                        id="subtitle"
                        defaultMessage="Subtitle"
                      />
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      fullWidth
                      name={`items[${index}].chainId`}
                      renderValue={(value: ChainId) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={theme.spacing(1)}
                          >
                            <Avatar
                              src={ipfsUriToUrl(
                                NETWORKS[value]?.imageUrl || '',
                              )}
                              style={{ width: 'auto', height: theme.spacing(2) }}
                            />
                            <Typography variant="body1">
                              {NETWORKS[value]?.name}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      {getNetworks({ includeTestnet: true })
                        .filter((n) => activeChainIds.includes(n.chainId))
                        .map((network: Network, index: number) => (
                          <MenuItem key={index} value={network?.chainId}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: theme.spacing(4),
                                  display: 'flex',
                                  alignItems: 'center',
                                  alignContent: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Avatar
                                  src={ipfsUriToUrl(network?.imageUrl || '')}
                                  sx={{
                                    width: 'auto',
                                    height: theme.spacing(2),
                                  }}
                                />
                              </Box>
                            </ListItemIcon>
                            <ListItemText primary={network?.name} />
                          </MenuItem>
                        ))}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    label={
                      <FormattedMessage
                        id="contract.address"
                        defaultMessage="Contract Address"
                      />
                    }
                    name={`items[${index}].contractAddress`}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid size={12}>
            <Box>
              <Stack spacing={theme.spacing(1)} alignItems="center" direction="row">
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
      </Paper>
    );
  }

  return (
    <Paper
      sx={(theme) => ({
        borderColor: itemMeta.error ? theme.palette.error.main : undefined,
        p: theme.spacing(2),
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack
          spacing={theme.spacing(2)}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {itemMeta.value.type === 'image' && (
            <>
              <Avatar variant="rounded" src={itemMeta.value.imageUrl} />
              {itemMeta.value.title && (
                <Box>
                  <Typography
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    variant="body1"
                    fontWeight="bold"
                  >
                    {itemMeta.value.title}
                  </Typography>
                  {itemMeta.value.subtitle && (
                    <Typography
                      sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {itemMeta.value.subtitle}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
          {itemMeta.value.type === 'asset' && (
            <AssetItem item={itemMeta.value} />
          )}
          {itemMeta.value.type === 'collection' && (
            <CollectionItem item={itemMeta.value} />
          )}
        </Stack>

        <Stack
          spacing={theme.spacing(0.5)}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton disabled={disableUp} onClick={onUp}>
            <ArrowUpward fontSize="inherit" />
          </IconButton>
          <IconButton disabled={disableDown} onClick={onDown}>
            <ArrowDownward fontSize="inherit" />
          </IconButton>
          <IconButton onClick={() => setIsEditing(true)}>
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton color="error" onClick={onRemove}>
            <Delete fontSize="inherit" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
