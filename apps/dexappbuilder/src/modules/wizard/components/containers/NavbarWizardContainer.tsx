import { AppConfig, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  MenuSettings,
  SearchbarConfig
} from '@dexkit/ui/modules/wizard/types/config';

import { useIsMobile } from '@dexkit/core';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import Navbar from '@dexkit/ui/components/Navbar';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {
  Alert,
  ButtonBase,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TextField
} from '@mui/material';
import { Field, Formik } from 'formik';
import { Select as FormikSelect } from 'formik-mui';
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
      <Grid item xs={12}>
        <MenuSection menu={menu} onSetMenu={setMenu} pages={config.pages} />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
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
            onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(e.target.value)}
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
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <ColorPickerField
                label="Gradient Start Color"
                value={values.layout?.glassSettings?.gradientStartColor || '#ffffff'}
                onChange={(color: string) => setFieldValue('layout.glassSettings.gradientStartColor', color)}
                defaultValue="#ffffff"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <ColorPickerField
              label="Text Color"
              value={values.layout?.glassSettings?.textColor || theme.palette.text.primary}
              onChange={(color) => setFieldValue('layout.glassSettings.textColor', color)}
              defaultValue={theme.palette.text.primary}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
                <MenuItem value="right">
                  <FormattedMessage id="glass.position.right" defaultMessage="Right" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
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
                <MenuItem value="right">
                  <FormattedMessage id="glass.position.right" defaultMessage="Right" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
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
                <MenuItem value="right">
                  <FormattedMessage id="glass.position.right" defaultMessage="Right" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Width (px)"
                  type="number"
                  size="small"
                  value={values.layout?.glassSettings?.customLogoWidth || 32}
                  onChange={(e) => setFieldValue('layout.glassSettings.customLogoWidth', parseInt(e.target.value) || 32)}
                  inputProps={{ min: 16, max: 200 }}
                />
                <TextField
                  label="Height (px)"
                  type="number"
                  size="small"
                  value={values.layout?.glassSettings?.customLogoHeight || 32}
                  onChange={(e) => setFieldValue('layout.glassSettings.customLogoHeight', parseInt(e.target.value) || 32)}
                  inputProps={{ min: 16, max: 200 }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
          <FormattedMessage id="glass.glassmorphism.effects" defaultMessage="Glassmorphism Effects" />
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
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
            marks={[
              { value: 10, label: '10' },
              { value: 30, label: '30' },
              { value: 50, label: '50' },
            ]}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
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
            marks={[
              { value: 0.05, label: '0.05' },
              { value: 0.10, label: '0.10' },
              { value: 0.15, label: '0.15' },
            ]}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
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
            marks={[
              { value: 0, label: '0' },
              { value: 15, label: '15' },
              { value: 30, label: '30' },
              { value: 50, label: '50' },
            ]}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={values.layout?.glassSettings?.disableBackground || false}
                onChange={(e) => setFieldValue('layout.glassSettings.disableBackground', e.target.checked)}
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
      </Box>
    </Box>
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
            },
          }
          : {
            layout: {
              type: 'navbar',
              variant: 'default',
              glassSettings: {},
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
      {({ submitForm, values, isValid, isSubmitting, setFieldValue }) => {
        const positionConflicts = values.layout?.variant === 'glass'
          ? getPositionConflicts(values.layout?.glassSettings)
          : [];
        const hasPositionConflicts = positionConflicts.length > 0;

        return (
          <Grid container spacing={isMobile ? 1.5 : 3}>
            {values.layout?.variant === 'glass' && hasPositionConflicts && (
              <Grid item xs={12}>
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
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
                </Field>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            {values.layout?.type === 'navbar' && values.layout?.variant === 'glass' && (
              <>
                <Grid item xs={12}>
                  <NavbarGlassSettingsPanel values={values} setFieldValue={setFieldValue} theme={theme} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      <FormattedMessage id="navbar.preview" defaultMessage="Navbar Preview" />
                    </Typography>
                    <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden', background: theme.palette.background.paper }}>
                      <Navbar
                        appConfig={{
                          ...config,
                          name: config.name || "Demo App",
                          logo: config.logo || {
                            url: "/favicon.ico",
                            width: 32,
                            height: 32
                          },
                          menuTree: config.menuTree || [
                            { name: "Home", type: "Page", href: "/" },
                            { name: "Swap", type: "Page", href: "/swap" },
                            { name: "Wallet", type: "Page", href: "/wallet" }
                          ],
                          menuSettings: {
                            ...config.menuSettings,
                            layout: {
                              type: values.layout?.type || 'navbar',
                              variant: values.layout?.variant || 'default',
                              glassSettings: {
                                backgroundType: values.layout?.glassSettings?.backgroundType || 'solid',
                                backgroundColor: values.layout?.glassSettings?.backgroundColor || theme.palette.background.default,
                                backgroundImage: values.layout?.glassSettings?.backgroundImage,
                                backgroundSize: values.layout?.glassSettings?.backgroundSize || 'cover',
                                backgroundPosition: values.layout?.glassSettings?.backgroundPosition || 'center',
                                gradientStartColor: values.layout?.glassSettings?.gradientStartColor || '#ffffff',
                                gradientEndColor: values.layout?.glassSettings?.gradientEndColor || '#000000',
                                gradientDirection: values.layout?.glassSettings?.gradientDirection || 'to bottom',
                                textColor: values.layout?.glassSettings?.textColor || theme.palette.text.primary,
                                iconColor: values.layout?.glassSettings?.iconColor || theme.palette.text.primary,
                                blurIntensity: values.layout?.glassSettings?.blurIntensity || 40,
                                glassOpacity: values.layout?.glassSettings?.glassOpacity || 0.10,
                                disableBackground: values.layout?.glassSettings?.disableBackground || false,
                                logoPosition: values.layout?.glassSettings?.logoPosition || "left",
                                menuPosition: values.layout?.glassSettings?.menuPosition || "center",
                                actionsPosition: values.layout?.glassSettings?.actionsPosition || "right",
                                logoSize: values.layout?.glassSettings?.logoSize || "medium",
                                customLogoWidth: values.layout?.glassSettings?.customLogoWidth || 32,
                                customLogoHeight: values.layout?.glassSettings?.customLogoHeight || 32,
                                ...values.layout?.glassSettings
                              }
                            },
                          },
                        }}
                        isPreview={false}
                      />
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
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
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
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
