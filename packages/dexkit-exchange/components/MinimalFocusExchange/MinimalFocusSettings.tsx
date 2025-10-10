import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { ExchangeGlassSettings } from "../../types";

export interface MinimalFocusSettingsProps {
  settings: ExchangeGlassSettings;
  onChange: (settings: ExchangeGlassSettings) => void;
}

function ColorPickerField({
  label,
  value,
  onChange,
  defaultValue = "#007AFF",
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Paper
          elevation={1}
          sx={{
            p: 0.25,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            width: 48,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              boxShadow: theme.shadows[2],
            },
          }}
        >
          <input
            type="color"
            value={value || defaultValue}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: theme.shape.borderRadius,
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
          />
        </Paper>
        <TextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultValue}
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2" color="text.secondary">
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

export default function MinimalFocusSettings({
  settings,
  onChange,
}: MinimalFocusSettingsProps) {
  const theme = useTheme();

  const handleColorChange = (field: keyof ExchangeGlassSettings) => (
    value: string
  ) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handleGradientChange = (field: keyof NonNullable<ExchangeGlassSettings['backgroundGradient']>) => (
    value: string
  ) => {
    onChange({
      ...settings,
      backgroundGradient: {
        ...settings.backgroundGradient,
        [field]: value,
      },
    });
  };

  const handleGlassmorphismChange = (field: keyof NonNullable<ExchangeGlassSettings['glassmorphism']>) => (
    value: boolean | number
  ) => {
    onChange({
      ...settings,
      glassmorphism: {
        ...settings.glassmorphism,
        [field]: value,
      },
    });
  };

  const handleAnimationsChange = (field: keyof NonNullable<ExchangeGlassSettings['animations']>) => (
    value: boolean | number | string
  ) => {
    onChange({
      ...settings,
      animations: {
        ...settings.animations,
        [field]: value,
      },
    });
  };

  const handleMinimalismChange = (field: keyof NonNullable<ExchangeGlassSettings['minimalism']>) => (
    value: boolean
  ) => {
    onChange({
      ...settings,
      minimalism: {
        ...settings.minimalism,
        [field]: value,
      },
    });
  };

  const handleSpacingChange = (field: keyof NonNullable<ExchangeGlassSettings['spacing']>) => (
    value: number
  ) => {
    onChange({
      ...settings,
      spacing: {
        ...settings.spacing,
        [field]: value,
      },
    });
  };

  const handleBackgroundTypeChange = (value: "solid" | "gradient") => {
    onChange({
      ...settings,
      backgroundType: value,
    });
  };

  const handleBackgroundColorChange = (value: string) => {
    onChange({
      ...settings,
      backgroundColor: value,
    });
  };

  return (
    <Stack spacing={3}>
      {/* Colores */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="glass.colors"
              defaultMessage="Colors"
            />
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <ColorPickerField
                label="Primary Color"
                value={settings.primaryColor}
                onChange={handleColorChange("primaryColor")}
                defaultValue="#007AFF"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <ColorPickerField
                label="Accent Color"
                value={settings.accentColor}
                onChange={handleColorChange("accentColor")}
                defaultValue="#34C759"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <ColorPickerField
                label="Text Color"
                value={settings.textColor}
                onChange={handleColorChange("textColor")}
                defaultValue="#1D1D1F"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="glass.background.type"
              defaultMessage="Background Type"
            />
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>
              <FormattedMessage
                id="glass.background.type"
                defaultMessage="Background Type"
              />
            </FormLabel>
            <RadioGroup
              value={settings.backgroundType || "solid"}
              onChange={(e) => {
                const newType = e.target.value as "solid" | "gradient";
                handleBackgroundTypeChange(newType);

                if (newType === 'solid' && !settings.backgroundColor) {
                  onChange({
                    ...settings,
                    backgroundType: newType,
                    backgroundColor: "#1a1a1a"
                  });
                } else if (newType === 'gradient' && (!settings.gradientStartColor || !settings.gradientEndColor)) {
                  onChange({
                    ...settings,
                    backgroundType: newType,
                    gradientStartColor: settings.gradientStartColor || "#1a1a1a",
                    gradientEndColor: settings.gradientEndColor || "#2d2d2d"
                  });
                }
              }}
              row
            >
              <FormControlLabel
                value="solid"
                control={<Radio />}
                label={
                  <FormattedMessage
                    id="glass.background.solid"
                    defaultMessage="Solid Color"
                  />
                }
              />
              <FormControlLabel
                value="gradient"
                control={<Radio />}
                label={
                  <FormattedMessage
                    id="glass.background.gradient"
                    defaultMessage="Background Gradient"
                  />
                }
              />
            </RadioGroup>
          </FormControl>

          {settings.backgroundType === "solid" && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ColorPickerField
                  label="Background Color"
                  value={settings.backgroundColor}
                  onChange={handleBackgroundColorChange}
                  defaultValue="#1a1a1a"
                />
              </Grid>
            </Grid>
          )}

          {(!settings.backgroundType || settings.backgroundType === "gradient") && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <ColorPickerField
                  label="From"
                  value={settings.backgroundGradient?.from}
                  onChange={handleGradientChange("from")}
                  defaultValue="#1a1a1a"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <ColorPickerField
                  label="To"
                  value={settings.backgroundGradient?.to}
                  onChange={handleGradientChange("to")}
                  defaultValue="#2d2d2d"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <FormLabel>Direction</FormLabel>
                  <Select
                    value={settings.backgroundGradient?.direction || "to-br"}
                    onChange={(e) => handleGradientChange("direction")(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="to-r">Right</MenuItem>
                    <MenuItem value="to-br">Bottom Right</MenuItem>
                    <MenuItem value="to-b">Bottom</MenuItem>
                    <MenuItem value="to-bl">Bottom Left</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="glass.glassmorphism"
              defaultMessage="Glassmorphism Effects"
            />
          </Typography>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.glassmorphism?.enabled || false}
                  onChange={(e) => handleGlassmorphismChange("enabled")(e.target.checked)}
                />
              }
              label={
                <FormattedMessage
                  id="glass.enable.glassmorphism"
                  defaultMessage="Enable Glassmorphism"
                />
              }
            />
            {settings.glassmorphism?.enabled && (
              <>
                <Box>
                  <Typography gutterBottom>Opacity</Typography>
                  <Slider
                    value={settings.glassmorphism?.opacity || 0.8}
                    onChange={(_, value) => handleGlassmorphismChange("opacity")(value as number)}
                    min={0.1}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box>
                  <Typography gutterBottom>Blur</Typography>
                  <Slider
                    value={settings.glassmorphism?.blur || 40}
                    onChange={(_, value) => handleGlassmorphismChange("blur")(value as number)}
                    min={10}
                    max={100}
                    step={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="glass.animations"
              defaultMessage="Smooth Animations"
            />
          </Typography>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.animations?.enabled || false}
                  onChange={(e) => handleAnimationsChange("enabled")(e.target.checked)}
                />
              }
              label={
                <FormattedMessage
                  id="minimal.focus.enable.animations"
                  defaultMessage="Enable Animations"
                />
              }
            />
            {settings.animations?.enabled && (
              <>
                <Box>
                  <Typography gutterBottom>Duration (ms)</Typography>
                  <Slider
                    value={settings.animations?.duration || 300}
                    onChange={(_, value) => handleAnimationsChange("duration")(value as number)}
                    min={100}
                    max={1000}
                    step={50}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                <FormControl fullWidth>
                  <FormLabel>Easing</FormLabel>
                  <Select
                    value={settings.animations?.easing || "ease-in-out"}
                    onChange={(e) => handleAnimationsChange("easing")(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="ease-in-out">Ease In Out</MenuItem>
                    <MenuItem value="ease-in">Ease In</MenuItem>
                    <MenuItem value="ease-out">Ease Out</MenuItem>
                    <MenuItem value="linear">Linear</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="minimal.focus.minimalism"
              defaultMessage="Minimalism Options"
            />
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.minimalism?.hideLabels || false}
                  onChange={(e) => handleMinimalismChange("hideLabels")(e.target.checked)}
                />
              }
              label={
                <FormattedMessage
                  id="minimal.focus.hide.labels"
                  defaultMessage="Hide Labels"
                />
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.minimalism?.compactMode || false}
                  onChange={(e) => handleMinimalismChange("compactMode")(e.target.checked)}
                />
              }
              label={
                <FormattedMessage
                  id="minimal.focus.compact.mode"
                  defaultMessage="Compact Mode"
                />
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.minimalism?.hideSecondaryInfo || false}
                  onChange={(e) => handleMinimalismChange("hideSecondaryInfo")(e.target.checked)}
                />
              }
              label={
                <FormattedMessage
                  id="minimal.focus.hide.secondary.info"
                  defaultMessage="Hide Secondary Info"
                />
              }
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="minimal.focus.spacing"
              defaultMessage="Spacing Configuration"
            />
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography gutterBottom>Component Spacing</Typography>
              <Slider
                value={settings.spacing?.component || 3}
                onChange={(_, value) => handleSpacingChange("component")(value as number)}
                min={1}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography gutterBottom>Internal Spacing</Typography>
              <Slider
                value={settings.spacing?.internal || 2}
                onChange={(_, value) => handleSpacingChange("internal")(value as number)}
                min={1}
                max={6}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
} 