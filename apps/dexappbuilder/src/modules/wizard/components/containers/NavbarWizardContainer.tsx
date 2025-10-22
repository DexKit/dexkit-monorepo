import { AppConfig, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  MenuSettings,
  SearchbarConfig
} from '@dexkit/ui/modules/wizard/types/config';

import { useIsMobile } from '@dexkit/core';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, Image as ImageIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  ButtonBase,
  InputAdornment,
  Paper
} from '@mui/material';
import { Field, Formik } from 'formik';
import { Select as FormikSelect, TextField as FormikTextField } from 'formik-mui';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import MenuSection from '../sections/MenuSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

function PagesMenuContainer({ config, onSave, onChange, onHasChanges }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menu, setMenu] = useState<MenuTree[]>(config.menuTree || []);

  const handleSave = () => {
    const newConfig = { ...config, menuTree: menu };
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, menuTree: menu };
    onChange(newConfig);
  }, [menu]);

  const hasChanged = useMemo(() => {
    if (config.menuTree && config.menuTree !== menu) {
      return true;
    } else {
      return false;
    }
  }, [menu, config.menuTree]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <MenuSection menu={menu} onSetMenu={setMenu} pages={config.pages} />
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanged}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? "0.875rem" : undefined,
              py: isMobile ? 0.75 : undefined,
              px: isMobile ? 2 : undefined,
            }}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

function NavbarSearchContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchConfig, setSearchConfig] = useState<SearchbarConfig>(
    config?.searchbar || {
      enabled: false,
      hideCollections: false,
      hideTokens: false,
    },
  );

  const handleSave = () => {
    const newConfig = { ...config, searchbar: searchConfig };
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, searchbar: searchConfig };
    onChange(newConfig);
  }, [searchConfig]);

  const hasChanged = useMemo(() => {
    let diff = config?.searchbar
      ? config?.searchbar
      : {
        enabled: false,
        hideCollections: false,
        hideTokens: false,
      };

    if (diff !== searchConfig) {
      return true;
    } else {
      return false;
    }
  }, [searchConfig, config.searchbar]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  const handleEnableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setSearchConfig({
        ...searchConfig,
        enabled: event.target.checked,
        hideCollections: false,
        hideTokens: false,
      });
    } else {
      setSearchConfig({
        ...searchConfig,
        enabled: event.target.checked,
      });
    }
  };

  const handleHideCollectionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchConfig({
      ...searchConfig,
      hideCollections: event.target.checked,
    });
  };

  const handleHideTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchConfig({
      ...searchConfig,
      hideTokens: event.target.checked,
    });
  };

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={searchConfig?.enabled}
                onChange={handleEnableChange}
              />
            }
            label={
              <FormattedMessage
                id={'enable.searchbar'}
                defaultMessage={'Enable searchbar'}
              />
            }
          />
          <FormControlLabel
            disabled={!searchConfig?.enabled}
            control={
              <Checkbox
                onChange={handleHideCollectionChange}
                checked={searchConfig?.hideCollections}
              />
            }
            label={
              <FormattedMessage
                id={'hide.collections.on.search'}
                defaultMessage={'Hide collections on search'}
              />
            }
          />
          <FormControlLabel
            disabled={!searchConfig?.enabled}
            control={
              <Checkbox
                onChange={handleHideTokenChange}
                checked={searchConfig?.hideTokens}
              />
            }
            label={
              <FormattedMessage
                id={'hide.tokens.on.search'}
                defaultMessage={'Hide tokens on search'}
              />
            }
          />
        </FormGroup>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanged}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? "0.875rem" : undefined,
              py: isMobile ? 0.75 : undefined,
              px: isMobile ? 2 : undefined,
            }}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

function convertToHex(color: string): string {
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    return color;
  }

  if (/^#[0-9A-F]{3}$/i.test(color)) {
    return color.replace(/^#([0-9A-F])([0-9A-F])([0-9A-F])$/i, '#$1$1$2$2$3$3');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#000000';

  ctx.fillStyle = color;
  const computedColor = ctx.fillStyle;

  if (/^#[0-9A-F]{6}$/i.test(computedColor)) {
    return computedColor;
  }

  return '#000000';
}

function ColorPickerField({
  label,
  value,
  onChange,
  defaultValue = "#ffffff"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}) {
  const theme = useTheme();
  const isMobile = useIsMobile();

  const hexDefaultValue = convertToHex(defaultValue);
  const hexValue = value ? convertToHex(value) : hexDefaultValue;

  return (
    <Box sx={{ mb: theme.spacing(1.5) }}>
      <Typography
        variant={isMobile ? "caption" : "body2"}
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary,
          mb: theme.spacing(1)
        }}
      >
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={theme.spacing(1.5)}
        alignItems="center"
        sx={{
          flexWrap: 'nowrap',
          width: '100%'
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: theme.spacing(0.125),
            borderRadius: theme.shape.borderRadius,
            border: `${theme.spacing(0.125)} solid ${theme.palette.divider}`,
            width: { xs: theme.spacing(4), sm: theme.spacing(4.5) },
            height: { xs: theme.spacing(4), sm: theme.spacing(4.5) },
            minWidth: { xs: theme.spacing(4), sm: theme.spacing(4.5) },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: theme.transitions.create(['box-shadow', 'border-color']),
            '&:hover': {
              boxShadow: theme.shadows[2],
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <input
            type="color"
            value={hexValue}
            onChange={(e: any) => onChange(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: theme.shape.borderRadius,
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          />
        </Paper>
        <TextField
          value={value || ""}
          onChange={(e: any) => onChange(e.target.value)}
          placeholder={hexDefaultValue}
          size="small"
          sx={{
            flex: 1,
            maxWidth: { xs: theme.spacing(25), sm: theme.spacing(30) },
            '& .MuiInputBase-root': {
              fontSize: theme.typography.body2.fontSize,
              height: { xs: theme.spacing(4), sm: theme.spacing(4.5) }
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize }
                  }}
                >
                  #
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}

function BackgroundImageSelector({
  value,
  onChange,
  sizeValue,
  onSizeChange,
  positionValue,
  onPositionChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  sizeValue?: string;
  onSizeChange: (size: string) => void;
  positionValue?: string;
  onPositionChange: (position: string) => void;
}) {
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useIsMobile();

  const handleSelectImage = (file: { url: string }) => {
    onChange(file.url);
    setShowMediaDialog(false);
  };

  const handleRemoveImage = () => {
    onChange(undefined);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" gutterBottom sx={{ fontWeight: theme.typography.fontWeightMedium }}>
        <FormattedMessage
          id="glass.background.image"
          defaultMessage="Background Image"
        />
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), flexWrap: 'wrap' }}>
        <ButtonBase
          onClick={() => setShowMediaDialog(true)}
          sx={{
            width: { xs: theme.spacing(15), sm: theme.spacing(20) },
            height: { xs: theme.spacing(10), sm: theme.spacing(12) },
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing(1),
            transition: theme.transitions.create(['border-color', 'background-color']),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: theme.shape.borderRadius,
              }}
            />
          ) : (
            <>
              <ImageIcon sx={{ fontSize: theme.spacing(4), color: theme.palette.text.secondary }} />
              <Typography variant="caption" color="text.secondary" textAlign="center">
                <FormattedMessage
                  id="glass.select.background.image"
                  defaultMessage="Select Background Image"
                />
              </Typography>
            </>
          )}
        </ButtonBase>

        {value && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveImage}
            sx={{ minWidth: 'auto' }}
          >
            <FormattedMessage
              id="glass.remove.background.image"
              defaultMessage="Remove Background Image"
            />
          </Button>
        )}
      </Box>
      {value && (
        <Box sx={{ mt: theme.spacing(3), display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
          <Grid container spacing={theme.spacing(2)}>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.size"
                    defaultMessage="Image Size"
                  />
                </InputLabel>
                <Select
                  value={sizeValue || "cover"}
                  onChange={(e) => onSizeChange(e.target.value as string)}
                  label="Image Size"
                >
                  <MenuItem value="cover">
                    <FormattedMessage
                      id="glass.background.size.cover"
                      defaultMessage="Cover (Fill Container)"
                    />
                  </MenuItem>
                  <MenuItem value="contain">
                    <FormattedMessage
                      id="glass.background.size.contain"
                      defaultMessage="Contain (Fit Inside)"
                    />
                  </MenuItem>
                  <MenuItem value="auto">
                    <FormattedMessage
                      id="glass.background.size.auto"
                      defaultMessage="Auto (Original Size)"
                    />
                  </MenuItem>
                  <MenuItem value="100% 100%">
                    <FormattedMessage
                      id="glass.background.size.stretch"
                      defaultMessage="Stretch (Fill Exactly)"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.position"
                    defaultMessage="Image Position"
                  />
                </InputLabel>
                <Select
                  value={positionValue || "center"}
                  onChange={(e) => onPositionChange(e.target.value as string)}
                  label="Image Position"
                >
                  <MenuItem value="center">
                    <FormattedMessage
                      id="glass.background.position.center"
                      defaultMessage="Center"
                    />
                  </MenuItem>
                  <MenuItem value="top">
                    <FormattedMessage
                      id="glass.background.position.top"
                      defaultMessage="Top"
                    />
                  </MenuItem>
                  <MenuItem value="bottom">
                    <FormattedMessage
                      id="glass.background.position.bottom"
                      defaultMessage="Bottom"
                    />
                  </MenuItem>
                  <MenuItem value="left">
                    <FormattedMessage
                      id="glass.background.position.left"
                      defaultMessage="Left"
                    />
                  </MenuItem>
                  <MenuItem value="right">
                    <FormattedMessage
                      id="glass.background.position.right"
                      defaultMessage="Right"
                    />
                  </MenuItem>
                  <MenuItem value="top left">
                    <FormattedMessage
                      id="glass.background.position.top-left"
                      defaultMessage="Top Left"
                    />
                  </MenuItem>
                  <MenuItem value="top right">
                    <FormattedMessage
                      id="glass.background.position.top-right"
                      defaultMessage="Top Right"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}
      <MediaDialog
        dialogProps={{
          open: showMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => setShowMediaDialog(false),
        }}
        onConfirmSelectFile={handleSelectImage}
      />
    </Box>
  );
}

function NavbarGlassSettingsPanel({
  values,
  setFieldValue,
  theme
}: {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  theme: any;
}) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
        <FormattedMessage id="glass.background.type" defaultMessage="Background Type" />
      </Typography>
      <RadioGroup
        value={values.layout?.glassSettings?.backgroundType || 'solid'}
        onChange={(e) => {
          const newType = e.target.value;
          setFieldValue('layout.glassSettings.backgroundType', newType);
          if (newType === 'solid' && !values.layout?.glassSettings?.backgroundColor) {
            setFieldValue('layout.glassSettings.backgroundColor', theme.palette.background.default);
          }
        }}
        row
      >
        <FormControlLabel value="solid" control={<Radio />} label={<FormattedMessage id="glass.background.solid" defaultMessage="Solid Color" />} />
        <FormControlLabel value="gradient" control={<Radio />} label={<FormattedMessage id="glass.background.gradient" defaultMessage="Gradient" />} />
        <FormControlLabel value="image" control={<Radio />} label={<FormattedMessage id="glass.background.image" defaultMessage="Background Image" />} />
      </RadioGroup>
      {values.layout?.glassSettings?.backgroundType === 'solid' && (
        <Box sx={{ mt: 2 }}>
          <ColorPickerField
            label="Background Color"
            value={values.layout?.glassSettings?.backgroundColor || theme.palette.background.default}
            onChange={(value: string) => setFieldValue('layout.glassSettings.backgroundColor', value)}
            defaultValue={theme.palette.background.default}
          />
        </Box>
      )}
      {values.layout?.glassSettings?.backgroundType === 'gradient' && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <ColorPickerField
                label="Gradient Start Color"
                value={values.layout?.glassSettings?.gradientStartColor || '#ffffff'}
                onChange={(color: string) => setFieldValue('layout.glassSettings.gradientStartColor', color)}
                defaultValue="#ffffff"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <ColorPickerField
                label="Gradient End Color"
                value={values.layout?.glassSettings?.gradientEndColor || '#000000'}
                onChange={(color: string) => setFieldValue('layout.glassSettings.gradientEndColor', color)}
                defaultValue="#000000"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage
                  id="glass.gradient.direction"
                  defaultMessage="Gradient Direction"
                />
              </InputLabel>
              <Select
                value={values.layout?.glassSettings?.gradientDirection || "to bottom"}
                onChange={(e) => setFieldValue('layout.glassSettings.gradientDirection', e.target.value)}
                label="Gradient Direction"
              >
                <MenuItem value="to bottom">
                  <FormattedMessage
                    id="glass.gradient.direction.bottom"
                    defaultMessage="Top to Bottom"
                  />
                </MenuItem>
                <MenuItem value="to top">
                  <FormattedMessage
                    id="glass.gradient.direction.top"
                    defaultMessage="Bottom to Top"
                  />
                </MenuItem>
                <MenuItem value="to right">
                  <FormattedMessage
                    id="glass.gradient.direction.right"
                    defaultMessage="Left to Right"
                  />
                </MenuItem>
                <MenuItem value="to left">
                  <FormattedMessage
                    id="glass.gradient.direction.left"
                    defaultMessage="Right to Left"
                  />
                </MenuItem>
                <MenuItem value="45deg">
                  <FormattedMessage
                    id="glass.gradient.direction.diagonal1"
                    defaultMessage="Diagonal ↗"
                  />
                </MenuItem>
                <MenuItem value="135deg">
                  <FormattedMessage
                    id="glass.gradient.direction.diagonal2"
                    defaultMessage="Diagonal ↘"
                  />
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      {values.layout?.glassSettings?.backgroundType === 'image' && (
        <BackgroundImageSelector
          value={values.layout?.glassSettings?.backgroundImage}
          onChange={(url: string | undefined) => setFieldValue('layout.glassSettings.backgroundImage', url)}
          sizeValue={values.layout?.glassSettings?.backgroundSize}
          onSizeChange={(size: string) => setFieldValue('layout.glassSettings.backgroundSize', size)}
          positionValue={values.layout?.glassSettings?.backgroundPosition}
          onPositionChange={(position: string) => setFieldValue('layout.glassSettings.backgroundPosition', position)}
        />
      )}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <ColorPickerField
              label="Text Color"
              value={values.layout?.glassSettings?.textColor || theme.palette.text.primary}
              onChange={(color) => setFieldValue('layout.glassSettings.textColor', color)}
              defaultValue={theme.palette.text.primary}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <ColorPickerField
              label="Icon Color"
              value={values.layout?.glassSettings?.iconColor || theme.palette.text.primary}
              onChange={(color) => setFieldValue('layout.glassSettings.iconColor', color)}
              defaultValue={theme.palette.text.primary}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 4, fontWeight: 'medium' }}>
          <FormattedMessage id="glass.layout.configuration" defaultMessage="Layout Configuration" />
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage id="glass.logo.position" defaultMessage="Logo Position" />
              </InputLabel>
              <Select
                value={values.layout?.glassSettings?.logoPosition || "left"}
                onChange={(e) => setFieldValue('layout.glassSettings.logoPosition', e.target.value)}
                label="Logo Position"
              >
                <MenuItem value="left">
                  <FormattedMessage id="glass.position.left" defaultMessage="Left" />
                </MenuItem>
                <MenuItem value="center">
                  <FormattedMessage id="glass.position.center" defaultMessage="Center" />
                </MenuItem>
                <MenuItem value="center-left">
                  <FormattedMessage id="glass.position.centerLeft" defaultMessage="Center Left" />
                </MenuItem>
                <MenuItem value="center-right">
                  <FormattedMessage id="glass.position.centerRight" defaultMessage="Center Right" />
                </MenuItem>
                <MenuItem value="right">
                  <FormattedMessage id="glass.position.right" defaultMessage="Right" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage id="glass.menu.position" defaultMessage="Menu Position" />
              </InputLabel>
              <Select
                value={values.layout?.glassSettings?.menuPosition || "center"}
                onChange={(e) => setFieldValue('layout.glassSettings.menuPosition', e.target.value)}
                label="Menu Position"
              >
                <MenuItem value="left">
                  <FormattedMessage id="glass.position.left" defaultMessage="Left" />
                </MenuItem>
                <MenuItem value="center">
                  <FormattedMessage id="glass.position.center" defaultMessage="Center" />
                </MenuItem>
                <MenuItem value="center-left">
                  <FormattedMessage id="glass.position.centerLeft" defaultMessage="Center Left" />
                </MenuItem>
                <MenuItem value="center-right">
                  <FormattedMessage id="glass.position.centerRight" defaultMessage="Center Right" />
                </MenuItem>
                <MenuItem value="right">
                  <FormattedMessage id="glass.position.right" defaultMessage="Right" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage id="glass.actions.position" defaultMessage="Actions Position" />
              </InputLabel>
              <Select
                value={values.layout?.glassSettings?.actionsPosition || "right"}
                onChange={(e) => setFieldValue('layout.glassSettings.actionsPosition', e.target.value)}
                label="Actions Position"
              >
                <MenuItem value="left">
                  <FormattedMessage id="glass.position.left" defaultMessage="Left" />
                </MenuItem>
                <MenuItem value="center">
                  <FormattedMessage id="glass.position.center" defaultMessage="Center" />
                </MenuItem>
                <MenuItem value="center-left">
                  <FormattedMessage id="glass.position.centerLeft" defaultMessage="Center Left" />
                </MenuItem>
                <MenuItem value="center-right">
                  <FormattedMessage id="glass.position.centerRight" defaultMessage="Center Right" />
                </MenuItem>
                <MenuItem value="right">
                  <FormattedMessage id="glass.position.right" defaultMessage="Right" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage id="glass.logo.size" defaultMessage="Logo Size" />
              </InputLabel>
              <Select
                value={values.layout?.glassSettings?.logoSize || "medium"}
                onChange={(e) => setFieldValue('layout.glassSettings.logoSize', e.target.value)}
                label="Logo Size"
              >
                <MenuItem value="small">
                  <FormattedMessage id="glass.size.small" defaultMessage="Small" />
                </MenuItem>
                <MenuItem value="medium">
                  <FormattedMessage id="glass.size.medium" defaultMessage="Medium" />
                </MenuItem>
                <MenuItem value="large">
                  <FormattedMessage id="glass.size.large" defaultMessage="Large" />
                </MenuItem>
                <MenuItem value="custom">
                  <FormattedMessage id="glass.size.custom" defaultMessage="Custom" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {values.layout?.glassSettings?.logoSize === 'custom' && (
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Width (px)"
                  type="number"
                  size="small"
                  value={values.layout?.glassSettings?.customLogoWidth || 32}
                  onChange={(e: any) => setFieldValue('layout.glassSettings.customLogoWidth', parseInt(e.target.value) || 32)}
                  inputProps={{ min: 16, max: 200 }}
                />
                <TextField
                  label="Height (px)"
                  type="number"
                  size="small"
                  value={values.layout?.glassSettings?.customLogoHeight || 32}
                  onChange={(e: any) => setFieldValue('layout.glassSettings.customLogoHeight', parseInt(e.target.value) || 32)}
                  inputProps={{ min: 16, max: 200 }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
          <FormattedMessage id="glass.glassmorphism.effects" defaultMessage="Glassmorphism Effects" />
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid
            size={{
              xs: 12,
              sm: 4
            }}>
            <Box sx={{ px: 1 }}>
              <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                <FormattedMessage
                  id="glass.blur.intensity"
                  defaultMessage="Blur Intensity"
                />
              </Typography>
              <Slider
                value={values.layout?.glassSettings?.blurIntensity || 40}
                onChange={(_, value: number | number[]) => setFieldValue('layout.glassSettings.blurIntensity', value)}
                min={10}
                max={60}
                step={5}
                valueLabelDisplay="auto"
                size="small"
                sx={{
                  height: 6,
                  '& .MuiSlider-thumb': {
                    height: 16,
                    width: 16,
                  },
                  '& .MuiSlider-track': {
                    height: 6,
                  },
                  '& .MuiSlider-rail': {
                    height: 6,
                  },
                }}
                marks={[
                  { value: 10, label: <Typography variant="caption">10</Typography> },
                  { value: 30, label: <Typography variant="caption">30</Typography> },
                  { value: 50, label: <Typography variant="caption">50</Typography> },
                ]}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4
            }}>
            <Box sx={{ px: 1 }}>
              <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                <FormattedMessage
                  id="glass.opacity"
                  defaultMessage="Glass Opacity"
                />
              </Typography>
              <Slider
                value={values.layout?.glassSettings?.glassOpacity || 0.10}
                onChange={(_, value: number | number[]) => setFieldValue('layout.glassSettings.glassOpacity', value)}
                min={0.01}
                max={0.15}
                step={0.01}
                valueLabelDisplay="auto"
                size="small"
                sx={{
                  height: 6,
                  '& .MuiSlider-thumb': {
                    height: 16,
                    width: 16,
                  },
                  '& .MuiSlider-track': {
                    height: 6,
                  },
                  '& .MuiSlider-rail': {
                    height: 6,
                  },
                }}
                marks={[
                  { value: 0.05, label: <Typography variant="caption">0.05</Typography> },
                  { value: 0.10, label: <Typography variant="caption">0.10</Typography> },
                  { value: 0.15, label: <Typography variant="caption">0.15</Typography> },
                ]}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4
            }}>
            <Box sx={{ px: 1 }}>
              <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                <FormattedMessage
                  id="glass.border.radius"
                  defaultMessage="Border Radius"
                />
              </Typography>
              <Slider
                value={values.layout?.glassSettings?.borderRadius || 0}
                onChange={(_, value: number | number[]) => setFieldValue('layout.glassSettings.borderRadius', value)}
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                size="small"
                sx={{
                  height: 6,
                  '& .MuiSlider-thumb': {
                    height: 16,
                    width: 16,
                  },
                  '& .MuiSlider-track': {
                    height: 6,
                  },
                  '& .MuiSlider-rail': {
                    height: 6,
                  },
                }}
                marks={[
                  { value: 0, label: <Typography variant="caption">0</Typography> },
                  { value: 15, label: <Typography variant="caption">15</Typography> },
                  { value: 30, label: <Typography variant="caption">30</Typography> },
                  { value: 50, label: <Typography variant="caption">50</Typography> },
                ]}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={values.layout?.glassSettings?.disableBackground || false}
                onChange={(e: any) => setFieldValue('layout.glassSettings.disableBackground', e.target.checked)}
              />
            }
            label={
              <FormattedMessage
                id="glass.disable.background"
                defaultMessage="Disable Background"
              />
            }
          />
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="glass.disable.background.description"
              defaultMessage="Remove background colors for complete transparency"
            />
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              const isDarkMode = theme.palette.mode === 'dark';
              const resetSettings = {
                backgroundType: 'solid',
                backgroundColor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
                backgroundImage: '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'scroll',
                gradientStartColor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
                gradientEndColor: isDarkMode ? theme.palette.background.paper : theme.palette.background.default,
                gradientDirection: 'to bottom',
                blurIntensity: 40,
                glassOpacity: 0.1,
                disableBackground: false,
                textColor: theme.palette.text.primary,
                iconColor: theme.palette.text.primary,
                logoPosition: 'left',
                menuPosition: 'center',
                actionsPosition: 'right',
                logoSize: 'medium',
                customLogoWidth: 48,
                customLogoHeight: 48,
                borderRadius: 0,
                tabBuyColor: theme.palette.primary.main,
                tabSellColor: theme.palette.secondary.main,
                tabBuyTextColor: theme.palette.primary.contrastText,
                tabSellTextColor: theme.palette.secondary.contrastText,
                fillButtonColor: theme.palette.primary.main,
                fillButtonTextColor: theme.palette.primary.contrastText,
                outlineButtonColor: theme.palette.primary.main,
                outlineButtonTextColor: theme.palette.primary.main,
              };

              setFieldValue('layout.glassSettings', resetSettings);
            }}
            sx={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.04)',
              },
            }}
          >
            <FormattedMessage
              id="reset.styles"
              defaultMessage="RESET STYLES"
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function BottomBarSettingsPanel({
  values,
  setFieldValue,
  theme
}: {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  theme: any;
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={isMobile ? 2 : 3}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="bottom.bar.settings" defaultMessage="Bottom Bar Settings" />
        </Typography>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6
        }}>
        <FormControlLabel
          control={
            <Switch
              checked={values.layout?.bottomBarSettings?.showText ?? true}
              onChange={(e: any) => setFieldValue('layout.bottomBarSettings.showText', e.target.checked)}
            />
          }
          label={<FormattedMessage id="show.text.labels" defaultMessage="Show Text Labels" />}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6
        }}>
        <FormControlLabel
          control={
            <Switch
              checked={values.layout?.bottomBarSettings?.showBorder ?? true}
              onChange={(e: any) => setFieldValue('layout.bottomBarSettings.showBorder', e.target.checked)}
            />
          }
          label={<FormattedMessage id="show.border" defaultMessage="Show Border" />}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <FormControl fullWidth>
          <Field
            fullWidth
            component={FormikSelect}
            name="layout.bottomBarSettings.iconSize"
            label={<FormattedMessage id="icon.size" defaultMessage="Icon Size" />}
          >
            <MenuItem value="small">
              <FormattedMessage id="small" defaultMessage="Small" />
            </MenuItem>
            <MenuItem value="medium">
              <FormattedMessage id="medium" defaultMessage="Medium" />
            </MenuItem>
            <MenuItem value="large">
              <FormattedMessage id="large" defaultMessage="Large" />
            </MenuItem>
          </Field>
        </FormControl>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <Field
          component={FormikTextField}
          name="layout.bottomBarSettings.fontSize"
          label={<FormattedMessage id="font.size" defaultMessage="Font Size (px)" />}
          type="number"
          inputProps={{ min: 8, max: 20 }}
          fullWidth
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <Field
          component={FormikTextField}
          name="layout.bottomBarSettings.elevation"
          label={<FormattedMessage id="elevation" defaultMessage="Elevation" />}
          type="number"
          inputProps={{ min: 0, max: 24 }}
          fullWidth
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <ColorPickerField
          label="Background Color"
          value={values.layout?.bottomBarSettings?.backgroundColor || theme.palette.background.paper}
          onChange={(color) => setFieldValue('layout.bottomBarSettings.backgroundColor', color)}
          defaultValue={theme.palette.background.paper}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <ColorPickerField
          label="Text Color"
          value={values.layout?.bottomBarSettings?.textColor || theme.palette.text.primary}
          onChange={(color) => setFieldValue('layout.bottomBarSettings.textColor', color)}
          defaultValue={theme.palette.text.primary}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <ColorPickerField
          label="Active Color"
          value={values.layout?.bottomBarSettings?.activeColor || theme.palette.primary.main}
          onChange={(color) => setFieldValue('layout.bottomBarSettings.activeColor', color)}
          defaultValue={theme.palette.primary.main}
        />
      </Grid>
      {values.layout?.bottomBarSettings?.showBorder && (
        <Grid
          size={{
            xs: 12,
            sm: 4
          }}>
          <ColorPickerField
            label="Border Color"
            value={values.layout?.bottomBarSettings?.borderColor || theme.palette.divider}
            onChange={(color) => setFieldValue('layout.bottomBarSettings.borderColor', color)}
            defaultValue={theme.palette.divider}
          />
        </Grid>
      )}
    </Grid>
  );
}

function MiniSidebarSettingsPanel({
  values,
  setFieldValue,
  theme
}: {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  theme: any;
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={isMobile ? 2 : 3}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="mini.sidebar.settings" defaultMessage="Mini Sidebar Settings" />
        </Typography>
      </Grid>
      <Grid size={12}>
        <FormControlLabel
          control={
            <Switch
              checked={values.layout?.miniSidebarSettings?.startExpanded ?? false}
              onChange={(e: any) => setFieldValue('layout.miniSidebarSettings.startExpanded', e.target.checked)}
            />
          }
          label={<FormattedMessage id="start.expanded" defaultMessage="Start Expanded" />}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <FormattedMessage
            id="start.expanded.description"
            defaultMessage="When enabled, the mini sidebar will start in expanded state when the page loads"
          />
        </Typography>
      </Grid>
    </Grid>
  );
}

function CustomNavbarSettingsPanel({
  values,
  setFieldValue,
  theme
}: {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  theme: any;
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={isMobile ? 2 : 3}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="custom.navbar.settings" defaultMessage="Custom Navbar Settings" />
        </Typography>
      </Grid>
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.background.settings" defaultMessage="Background Settings" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={12}>
                <RadioGroup
                  value={values.layout?.customSettings?.backgroundType || 'solid'}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFieldValue('layout.customSettings.backgroundType', newType);
                  }}
                  row
                >
                  <FormControlLabel value="solid" control={<Radio />} label={<FormattedMessage id="custom.background.solid" defaultMessage="Solid Color" />} />
                  <FormControlLabel value="gradient" control={<Radio />} label={<FormattedMessage id="custom.background.gradient" defaultMessage="Gradient" />} />
                  <FormControlLabel value="image" control={<Radio />} label={<FormattedMessage id="custom.background.image" defaultMessage="Background Image" />} />
                </RadioGroup>
              </Grid>

              {values.layout?.customSettings?.backgroundType === 'solid' && (
                <Grid size={12}>
                  <ColorPickerField
                    label="Background Color"
                    value={values.layout?.customSettings?.backgroundColor || theme.palette.background.default}
                    onChange={(color) => setFieldValue('layout.customSettings.backgroundColor', color)}
                    defaultValue={theme.palette.background.default}
                  />
                </Grid>
              )}

              {values.layout?.customSettings?.backgroundType === 'gradient' && (
                <>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Start Color"
                      value={values.layout?.customSettings?.gradientStartColor || '#ff0000'}
                      onChange={(color) => setFieldValue('layout.customSettings.gradientStartColor', color)}
                      defaultValue="#ff0000"
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="End Color"
                      value={values.layout?.customSettings?.gradientEndColor || '#0000ff'}
                      onChange={(color) => setFieldValue('layout.customSettings.gradientEndColor', color)}
                      defaultValue="#0000ff"
                    />
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <InputLabel id="gradient-direction-label">Gradient Direction</InputLabel>
                      <Select
                        labelId="gradient-direction-label"
                        id="gradient-direction-select"
                        value={values.layout?.customSettings?.gradientDirection || 'to right'}
                        onChange={(e) => setFieldValue('layout.customSettings.gradientDirection', e.target.value)}
                        label="Gradient Direction"
                      >
                        <MenuItem value="to right">To Right</MenuItem>
                        <MenuItem value="to left">To Left</MenuItem>
                        <MenuItem value="to bottom">To Bottom</MenuItem>
                        <MenuItem value="to top">To Top</MenuItem>
                        <MenuItem value="to bottom right">To Bottom Right</MenuItem>
                        <MenuItem value="to bottom left">To Bottom Left</MenuItem>
                        <MenuItem value="to top right">To Top Right</MenuItem>
                        <MenuItem value="to top left">To Top Left</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              {
                values.layout?.customSettings?.backgroundType === 'image' && (
                  <Grid size={12}>
                    <BackgroundImageSelector
                      value={values.layout?.customSettings?.backgroundImage}
                      onChange={(url) => setFieldValue('layout.customSettings.backgroundImage', url)}
                      sizeValue={values.layout?.customSettings?.backgroundSize || 'cover'}
                      onSizeChange={(size) => setFieldValue('layout.customSettings.backgroundSize', size)}
                      positionValue={values.layout?.customSettings?.backgroundPosition || 'center'}
                      onPositionChange={(position) => setFieldValue('layout.customSettings.backgroundPosition', position)}
                    />
                  </Grid>
                )
              }
            </Grid >

            {
              values.layout?.customSettings?.backgroundType !== 'image' && (
                <>
                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={2}>
                    {values.layout?.customSettings?.backgroundType === 'solid' && (
                      <>
                        <Grid size={6}>
                          <ColorPickerField
                            label="Background Color (Light)"
                            value={values.layout?.customSettings?.colorScheme?.light?.backgroundColor || theme.palette.background.paper}
                            onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.backgroundColor', color)}
                            defaultValue={theme.palette.background.paper}
                          />
                        </Grid>
                        <Grid size={6}>
                          <ColorPickerField
                            label="Background Color (Dark)"
                            value={values.layout?.customSettings?.colorScheme?.dark?.backgroundColor || theme.palette.background.default}
                            onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.backgroundColor', color)}
                            defaultValue={theme.palette.background.default}
                          />
                        </Grid>
                      </>
                    )}
                    {values.layout?.customSettings?.backgroundType === 'gradient' && (
                      <>
                        <Grid size={12}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                            <FormattedMessage id="custom.light.mode" defaultMessage="Light Mode Background" />
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={6}>
                              <ColorPickerField
                                label="Gradient Start (Light)"
                                value={values.layout?.customSettings?.colorScheme?.light?.gradientStartColor || theme.palette.primary.main}
                                onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.gradientStartColor', color)}
                                defaultValue={theme.palette.primary.main}
                              />
                            </Grid>
                            <Grid size={6}>
                              <ColorPickerField
                                label="Gradient End (Light)"
                                value={values.layout?.customSettings?.colorScheme?.light?.gradientEndColor || theme.palette.secondary.main}
                                onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.gradientEndColor', color)}
                                defaultValue={theme.palette.secondary.main}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 2 }}>
                            <FormattedMessage id="custom.dark.mode" defaultMessage="Dark Mode Background" />
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={6}>
                              <ColorPickerField
                                label="Gradient Start (Dark)"
                                value={values.layout?.customSettings?.colorScheme?.dark?.gradientStartColor || theme.palette.primary.dark}
                                onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.gradientStartColor', color)}
                                defaultValue={theme.palette.primary.dark}
                              />
                            </Grid>
                            <Grid size={6}>
                              <ColorPickerField
                                label="Gradient End (Dark)"
                                value={values.layout?.customSettings?.colorScheme?.dark?.gradientEndColor || theme.palette.secondary.dark}
                                onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.gradientEndColor', color)}
                                defaultValue={theme.palette.secondary.dark}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              )
            }
          </AccordionDetails >
        </Accordion >
      </Grid >
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.layout.positioning" defaultMessage="Layout & Positioning" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={4}>
                <FormControl fullWidth>
                  <InputLabel id="logo-position-label">Logo Position</InputLabel>
                  <Select
                    labelId="logo-position-label"
                    id="logo-position-select"
                    value={values.layout?.customSettings?.logoPosition || 'left'}
                    onChange={(e) => setFieldValue('layout.customSettings.logoPosition', e.target.value)}
                    label="Logo Position"
                  >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="center-left">Center Left</MenuItem>
                    <MenuItem value="center-right">Center Right</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth>
                  <InputLabel id="menu-position-label">Menu Position</InputLabel>
                  <Select
                    labelId="menu-position-label"
                    id="menu-position-select"
                    value={values.layout?.customSettings?.menuPosition || 'center'}
                    onChange={(e) => setFieldValue('layout.customSettings.menuPosition', e.target.value)}
                    label="Menu Position"
                  >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="center-left">Center Left</MenuItem>
                    <MenuItem value="center-right">Center Right</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth>
                  <InputLabel id="actions-position-label">Actions Position</InputLabel>
                  <Select
                    labelId="actions-position-label"
                    id="actions-position-select"
                    value={values.layout?.customSettings?.actionsPosition || 'right'}
                    onChange={(e) => setFieldValue('layout.customSettings.actionsPosition', e.target.value)}
                    label="Actions Position"
                  >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="center-left">Center Left</MenuItem>
                    <MenuItem value="center-right">Center Right</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.logo.settings" defaultMessage="Logo Settings" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.layout?.customSettings?.showLogo !== false}
                      onChange={(e: any) => setFieldValue('layout.customSettings.showLogo', e.target.checked)}
                    />
                  }
                  label="Show Logo"
                />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Logo Size</InputLabel>
                  <Select
                    value={values.layout?.customSettings?.logoSize || 'medium'}
                    onChange={(e) => setFieldValue('layout.customSettings.logoSize', e.target.value)}
                    label="Logo Size"
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {values.layout?.customSettings?.logoSize === 'custom' && (
                <>
                  <Grid size={3}>
                    <TextField
                      fullWidth
                      label="Width (px)"
                      type="number"
                      value={values.layout?.customSettings?.customLogoWidth || 48}
                      onChange={(e: any) => setFieldValue('layout.customSettings.customLogoWidth', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid size={3}>
                    <TextField
                      fullWidth
                      label="Height (px)"
                      type="number"
                      value={values.layout?.customSettings?.customLogoHeight || 48}
                      onChange={(e: any) => setFieldValue('layout.customSettings.customLogoHeight', parseInt(e.target.value))}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.text.colors" defaultMessage="Text & Colors" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  <FormattedMessage id="custom.light.mode" defaultMessage="Light Mode Colors" />
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Text Color (Light)"
                      value={values.layout?.customSettings?.colorScheme?.light?.textColor || theme.palette.text.primary}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.textColor', color)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Icon Color (Light)"
                      value={values.layout?.customSettings?.colorScheme?.light?.iconColor || theme.palette.text.primary}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.iconColor', color)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Menu Hover Color (Light)"
                      value={values.layout?.customSettings?.colorScheme?.light?.menuHoverColor || theme.palette.primary.main}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.menuHoverColor', color)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Icon Hover Color (Light)"
                      value={values.layout?.customSettings?.colorScheme?.light?.iconHoverColor || theme.palette.primary.main}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.light.iconHoverColor', color)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 2 }}>
                  <FormattedMessage id="custom.dark.mode" defaultMessage="Dark Mode Colors" />
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Text Color (Dark)"
                      value={values.layout?.customSettings?.colorScheme?.dark?.textColor || theme.palette.text.primary}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.textColor', color)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Icon Color (Dark)"
                      value={values.layout?.customSettings?.colorScheme?.dark?.iconColor || theme.palette.text.primary}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.iconColor', color)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Menu Hover Color (Dark)"
                      value={values.layout?.customSettings?.colorScheme?.dark?.menuHoverColor || theme.palette.primary.main}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.menuHoverColor', color)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid size={6}>
                    <ColorPickerField
                      label="Icon Hover Color (Dark)"
                      value={values.layout?.customSettings?.colorScheme?.dark?.iconHoverColor || theme.palette.primary.main}
                      onChange={(color) => setFieldValue('layout.customSettings.colorScheme.dark.iconHoverColor', color)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.spacing.dimensions" defaultMessage="Spacing & Dimensions" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Height (px)"
                  type="number"
                  value={values.layout?.customSettings?.height || 64}
                  onChange={(e: any) => setFieldValue('layout.customSettings.height', parseInt(e.target.value))}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Padding"
                  type="number"
                  value={values.layout?.customSettings?.padding || 8}
                  onChange={(e: any) => setFieldValue('layout.customSettings.padding', parseInt(e.target.value))}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Menu Spacing"
                  type="number"
                  value={values.layout?.customSettings?.menuSpacing || 16}
                  onChange={(e: any) => setFieldValue('layout.customSettings.menuSpacing', parseInt(e.target.value))}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.visual.effects" defaultMessage="Visual Effects" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={4}>
                <Typography gutterBottom sx={{ mb: 2 }}>Opacity</Typography>
                <Slider
                  value={1 - (values.layout?.customSettings?.opacity || 0)}
                  onChange={(_, value) => setFieldValue('layout.customSettings.opacity', 1 - (value as number))}
                  min={0}
                  max={0.9}
                  step={0.1}
                  marks={[
                    { value: 0, label: '100%' },
                    { value: 0.5, label: '50%' },
                    { value: 0.9, label: '10%' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round((1 - value) * 100)}%`}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={4}>
                <Typography gutterBottom sx={{ mb: 2 }}>Border Radius</Typography>
                <Slider
                  value={values.layout?.customSettings?.borderRadius || 0}
                  onChange={(_, value) => setFieldValue('layout.customSettings.borderRadius', value as number)}
                  min={0}
                  max={50}
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={4}>
                <Typography gutterBottom sx={{ mb: 2 }}>Background Blur</Typography>
                <Slider
                  value={values.layout?.customSettings?.blurIntensity || 0}
                  onChange={(_, value) => setFieldValue('layout.customSettings.blurIntensity', value as number)}
                  min={0}
                  max={50}
                  step={1}
                  marks={[
                    { value: 0, label: 'Off' },
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value === 0 ? 'Off' : `${value}px`}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="custom.effects.styling" defaultMessage="Effects & Styling" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.layout?.customSettings?.showShadow || false}
                      onChange={(e: any) => setFieldValue('layout.customSettings.showShadow', e.target.checked)}
                    />
                  }
                  label="Show Shadow"
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.layout?.customSettings?.showBorder || false}
                      onChange={(e: any) => setFieldValue('layout.customSettings.showBorder', e.target.checked)}
                    />
                  }
                  label="Show Border"
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.layout?.customSettings?.showIcons !== false}
                      onChange={(e: any) => setFieldValue('layout.customSettings.showIcons', e.target.checked)}
                    />
                  }
                  label="Show Icons"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              const isDarkMode = theme.palette.mode === 'dark';
              const resetSettings = {
                backgroundType: 'solid',
                backgroundColor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
                blurIntensity: 0,
                borderRadius: 0,
                padding: 1,
                height: 64,
                logoPosition: 'left',
                logoSize: 'medium',
                showLogo: true,
                menuPosition: 'center',
                menuHoverColor: theme.palette.primary.main,
                menuActiveColor: theme.palette.primary.main,
                menuFontSize: 16,
                menuFontWeight: '600',
                menuSpacing: 2,
                actionsPosition: 'right',
                iconColor: theme.palette.text.primary,
                iconHoverColor: theme.palette.primary.main,
                iconSize: 'medium',
                showIcons: true,
                textColor: theme.palette.text.primary,
                linkColor: theme.palette.primary.main,
                linkHoverColor: theme.palette.primary.dark,
                showShadow: false,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowIntensity: 4,
                showBorder: false,
                borderColor: theme.palette.divider,
                borderWidth: 1,
                borderPosition: 'bottom',
                opacity: 1,
                mobileHeight: 56,
                mobilePadding: 1,
                mobileLogoSize: 'medium',
              };

              setFieldValue('layout.customSettings', resetSettings);
            }}
            sx={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.04)',
              },
            }}
          >
            <FormattedMessage
              id="reset.styles"
              defaultMessage="RESET STYLES"
            />
          </Button>
        </Box>
      </Grid>
    </Grid >
  );
}

const formSchema = z.object({
  layout: z
    .object({
      type: z.string(),
      variant: z.string().optional(),
      glassSettings: z.object({
        logoPosition: z.string().optional(),
        menuPosition: z.string().optional(),
        actionsPosition: z.string().optional(),
      }).optional().refine((data) => {
        if (!data) return true;

        const positions = [
          data.logoPosition,
          data.menuPosition,
          data.actionsPosition
        ].filter(Boolean);

        const uniquePositions = new Set(positions);
        return uniquePositions.size === positions.length;
      }, {
        message: "Each element must have a unique position"
      })
    })
    .optional(),
});

function getPositionConflicts(glassSettings: any) {
  if (!glassSettings) return [];

  const positionMap: { [key: string]: string[] } = {};
  const elements = [
    { name: 'Logo', position: glassSettings.logoPosition || 'left' },
    { name: 'Menu', position: glassSettings.menuPosition || 'center' },
    { name: 'Actions', position: glassSettings.actionsPosition || 'right' }
  ];

  elements.forEach(element => {
    if (!positionMap[element.position]) {
      positionMap[element.position] = [];
    }
    positionMap[element.position].push(element.name);
  });

  const conflicts: string[] = [];
  Object.entries(positionMap).forEach(([position, elementsInPosition]) => {
    if (elementsInPosition.length > 1) {
      conflicts.push(`${position}: ${elementsInPosition.join(', ')}`);
    }
  });

  return conflicts;
}

export function NavbarLayoutContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasChanged, setHasChanged] = useState(false);

  const handleSubmit = async (values: MenuSettings) => {
    onSave({ ...config, menuSettings: values });
    setHasChanged(false);
  };

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={
        config.menuSettings
          ? {
            ...config.menuSettings,
            layout: {
              type: config.menuSettings.layout?.type || 'navbar',
              variant: config.menuSettings.layout?.variant || 'default',
              glassSettings: config.menuSettings.layout?.glassSettings || {},
              customSettings: {
                opacity: 1,
                blurIntensity: 0,
                colorScheme: {
                  light: {},
                  dark: {}
                },
                ...config.menuSettings.layout?.customSettings
              },
              bottomBarSettings: {
                showText: true,
                showBorder: true,
                iconSize: 'medium',
                fontSize: 12,
                elevation: 3,
                ...config.menuSettings.layout?.bottomBarSettings
              },
              miniSidebarSettings: {
                startExpanded: false,
                ...config.menuSettings.layout?.miniSidebarSettings
              },
            },
          }
          : {
            layout: {
              type: 'navbar',
              variant: 'default',
              glassSettings: {},
              customSettings: {
                opacity: 1,
                blurIntensity: 0,
                colorScheme: {
                  light: {},
                  dark: {}
                },
              },
              bottomBarSettings: {
                showText: true,
                showBorder: true,
                iconSize: 'medium',
                fontSize: 12,
                elevation: 3,
              },
              miniSidebarSettings: {
                startExpanded: false,
              },
            },
          }
      }
      validate={(values: MenuSettings) => {
        setHasChanged(true);
        const newConfig = { ...config, menuSettings: values };
        onChange(newConfig);
      }}
      validationSchema={toFormikValidationSchema(formSchema)}
    >
      {({ submitForm, values, isValid, isSubmitting, setFieldValue }: any) => {
        const positionConflicts = values.layout?.variant === 'glass'
          ? getPositionConflicts(values.layout?.glassSettings)
          : [];
        const hasPositionConflicts = positionConflicts.length > 0;

        return (
          <Grid container spacing={isMobile ? 1.5 : 3}>
            {values.layout?.variant === 'glass' && hasPositionConflicts && (
              <Grid size={12}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <FormattedMessage
                      id="glass.position.conflicts.title"
                      defaultMessage="Position conflicts detected:"
                    />
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    {positionConflicts.map((conflict, index) => (
                      <Typography component="li" variant="body2" key={index}>
                        {conflict}
                      </Typography>
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <FormattedMessage
                      id="glass.position.conflicts.description"
                      defaultMessage="Please assign unique positions to each element before saving."
                    />
                  </Typography>
                </Alert>
              </Grid>
            )}
            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <FormControl fullWidth>
                <Field
                  component={FormikSelect}
                  name="layout.type"
                  label={
                    <FormattedMessage id="menu.type" defaultMessage="Menu Type" />
                  }
                  fullWidth
                >
                  <MenuItem value="navbar">
                    <FormattedMessage id="navbar" defaultMessage="Navbar" />
                  </MenuItem>
                  <MenuItem value="sidebar">
                    <FormattedMessage id="sideBar" defaultMessage="Sidebar" />
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <FormControl fullWidth>
                <Field
                  fullWidth
                  component={FormikSelect}
                  name="layout.variant"
                  label={
                    <FormattedMessage id="variant" defaultMessage="Variant" />
                  }
                >
                  <MenuItem value="default">
                    <FormattedMessage id="default" defaultMessage="Default" />
                  </MenuItem>
                  {values.layout?.type === 'sidebar' && (
                    <MenuItem value="mini">
                      <FormattedMessage id="mini" defaultMessage="Mini" />
                    </MenuItem>
                  )}
                  {values.layout?.type === 'sidebar' && (
                    <MenuItem value="dense">
                      <FormattedMessage id="dense" defaultMessage="Dense" />
                    </MenuItem>
                  )}
                  {values.layout?.type === 'sidebar' && (
                    <MenuItem value="prominent">
                      <FormattedMessage id="prominent" defaultMessage="Prominent" />
                    </MenuItem>
                  )}
                  {values.layout?.type === 'navbar' && (
                    <MenuItem value="alt">
                      <FormattedMessage id="alt" defaultMessage="Alt" />
                    </MenuItem>
                  )}
                  {values.layout?.type === 'navbar' && (
                    <MenuItem value="glass">
                      <FormattedMessage id="glass.variant" defaultMessage="Glass" />
                    </MenuItem>
                  )}
                  {values.layout?.type === 'navbar' && (
                    <MenuItem value="custom">
                      <FormattedMessage id="custom.variant" defaultMessage="Custom" />
                    </MenuItem>
                  )}
                  {values.layout?.type === 'navbar' && (
                    <MenuItem value="bottom">
                      <FormattedMessage id="bottom.bar" defaultMessage="Bottom Bar" />
                    </MenuItem>
                  )}
                </Field>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            {values.layout?.type === 'navbar' && values.layout?.variant === 'glass' && (
              <>
                <Grid size={12}>
                  <NavbarGlassSettingsPanel values={values} setFieldValue={setFieldValue} theme={theme} />
                </Grid>
              </>
            )}
            {values.layout?.type === 'navbar' && values.layout?.variant === 'bottom' && (
              <Grid size={12}>
                <BottomBarSettingsPanel values={values} setFieldValue={setFieldValue} theme={theme} />
              </Grid>
            )}
            {values.layout?.type === 'sidebar' && values.layout?.variant === 'mini' && (
              <Grid size={12}>
                <MiniSidebarSettingsPanel values={values} setFieldValue={setFieldValue} theme={theme} />
              </Grid>
            )}
            {values.layout?.type === 'navbar' && values.layout?.variant === 'custom' && (
              <Grid size={12}>
                <CustomNavbarSettingsPanel values={values} setFieldValue={setFieldValue} theme={theme} />
              </Grid>
            )}
            <Grid size={12}>
              <Box>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    disabled={!isValid || isSubmitting || hasPositionConflicts}
                    onClick={submitForm}
                    variant="contained"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      fontSize: isMobile ? "0.875rem" : undefined,
                      py: isMobile ? 0.75 : undefined,
                      px: isMobile ? 2 : undefined,
                    }}
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        );
      }}
    </Formik>
  );
}

export default function NavbarWizardContainer(props: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              fontWeight: 600,
              mb: 0.5
            }}
          >
            <FormattedMessage id="navbar" defaultMessage="Navbar" />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="navbar.wizard.description"
              defaultMessage="Organize your app navbar. You can edit menus and searchbar"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label={<FormattedMessage id="menu" defaultMessage={'Menu'} />}
                value="1"
              />
              <Tab
                label={
                  <FormattedMessage
                    id="searchbar"
                    defaultMessage={'Searchbar'}
                  />
                }
                value="2"
              />
              <Tab
                label={<FormattedMessage id="layout" defaultMessage="Layout" />}
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <PagesMenuContainer {...props} />
          </TabPanel>
          <TabPanel value="2">
            <NavbarSearchContainer {...props} />
          </TabPanel>
          <TabPanel value="3">
            <NavbarLayoutContainer {...props} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
}
