import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  TextField as TextFieldMui,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Field, Formik, getIn } from "formik";

import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";

import { ChainId, useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import {
  getChainName,
  ipfsUriToUrl,
  isAddressEqual,
  parseChainId,
} from "@dexkit/core/utils";
import { Select as FormikSelect } from "formik-mui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DexkitExchangeSettings, ExchangeSettingsSchema, ExchangeVariant } from "../../types";
import FormActions from "./ExchangeSettingsFormActions";

import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import {
  DragIndicator as DragIndicatorIcon,
  Info as InfoIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import { useFormikContext } from "formik";
import setWith from "lodash/setWith";
import {
  DEFAULT_TOKENS,
  QUOTE_TOKENS_SUGGESTION,
} from "../../constants/tokens";
import ExchangeQuoteTokensInput from "./ExchangeQuoteTokensInput";
import ExchangeTokenInput from "./ExchangeTokenInput";
import SelectNetworksDialog from "./SelectNetworksDialog";

function SaveOnChangeListener({
  onSave,
  onValidate,
}: {
  onSave: (settings: DexkitExchangeSettings) => void;
  onValidate?: (isValid: boolean) => void;
}) {
  const { values, isValid } = useFormikContext<DexkitExchangeSettings>();
  useEffect(() => {
    onSave(values);
  }, [values, isValid]);

  useEffect(() => {
    if (onValidate) {
      onValidate(isValid);
    }
  }, [isValid, onValidate]);

  return null;
}

export interface ExchangeSettingsFormProps {
  onCancel: () => void;
  onSave: (settings: DexkitExchangeSettings) => void;
  onChange?: (settings: DexkitExchangeSettings) => void;
  saveOnChange?: boolean;
  showSaveButton?: boolean;
  settings?: DexkitExchangeSettings;
  tokens: Token[];
  activeChainIds: number[];
  onValidate?: (isValid: boolean) => void;
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

  return (
    <Box sx={{ mb: theme.spacing(2) }}>
      <Typography
        variant={isMobile ? "caption" : "body2"}
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary
        }}
      >
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={theme.spacing(2)}
        alignItems="center"
        sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
      >
        <Paper
          elevation={1}
          sx={{
            p: theme.spacing(0.25),
            borderRadius: theme.shape.borderRadius,
            border: `${theme.spacing(0.125)} solid ${theme.palette.divider}`,
            minWidth: { xs: theme.spacing(5), sm: theme.spacing(6) },
            height: { xs: theme.spacing(4), sm: theme.spacing(5) },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: theme.transitions.create(['box-shadow', 'border-color']),
            '&:hover': {
              boxShadow: theme.shadows[2],
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <input
            type="color"
            value={value || defaultValue}
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
          placeholder={defaultValue}
          size={isMobile ? "small" : "medium"}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: theme.spacing(20) },
            '& .MuiInputBase-root': {
              fontSize: {
                xs: theme.typography.body2.fontSize,
                sm: theme.typography.body1.fontSize
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
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

function VariantConfigurationTab() {
  const { values, setFieldValue } = useFormikContext<DexkitExchangeSettings>();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h6" gutterBottom>
        Exchange Variant Configuration
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Variant</InputLabel>
        <Select
          value={values.variant || "default"}
          onChange={(e) => setFieldValue("variant", e.target.value)}
          label="Variant"
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>

      {values.variant === "custom" && (
        <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Custom Variant Settings
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
            <Tab label="Layout" />
            <Tab label="Components" />
            <Tab label="Container" />
            <Tab label="Pair Info" />
            <Tab label="Trade Widget" />
            <Tab label="Chart Colors" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Layout Type</InputLabel>
                <Select
                  value={values.customVariantSettings?.layout || "grid"}
                  onChange={(e) => setFieldValue("customVariantSettings.layout", e.target.value)}
                  label="Layout Type"
                >
                  <MenuItem value="grid">Grid</MenuItem>
                  <MenuItem value="horizontal">Horizontal</MenuItem>
                  <MenuItem value="vertical">Vertical</MenuItem>
                </Select>
              </FormControl>

              <Typography gutterBottom sx={{ mt: 2 }}>
                Spacing: {values.customVariantSettings?.spacing || 2}
              </Typography>
              <Slider
                value={values.customVariantSettings?.spacing || 2}
                onChange={(e, value) => setFieldValue("customVariantSettings.spacing", value)}
                min={0}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.customVariantSettings?.showPairInfo !== false}
                    onChange={(e) => setFieldValue("customVariantSettings.showPairInfo", e.target.checked)}
                  />
                }
                label="Show Pair Information"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.customVariantSettings?.showTradingGraph !== false}
                    onChange={(e) => setFieldValue("customVariantSettings.showTradingGraph", e.target.checked)}
                  />
                }
                label="Show Trading Graph"
                sx={{ display: "block" }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.customVariantSettings?.showTradeWidget !== false}
                    onChange={(e) => setFieldValue("customVariantSettings.showTradeWidget", e.target.checked)}
                  />
                }
                label="Show Trade Widget"
                sx={{ display: "block" }}
              />

              <Box sx={{ mt: 3 }}>
                <DragDropComponentOrder
                  value={values.customVariantSettings?.componentOrder || ['pairInfo', 'tradeWidget', 'tradingGraph']}
                  onChange={(newOrder) => setFieldValue("customVariantSettings.componentOrder", newOrder)}
                />
              </Box>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.backgroundColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.backgroundColor", value)}
              />

              <Typography gutterBottom sx={{ mt: 2 }}>
                Border Radius: {values.customVariantSettings?.borderRadius || 0}px
              </Typography>
              <Slider
                value={values.customVariantSettings?.borderRadius || 0}
                onChange={(e, value) => setFieldValue("customVariantSettings.borderRadius", value)}
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
              />

              <Typography gutterBottom sx={{ mt: 2 }}>
                Padding: {values.customVariantSettings?.padding || 2}
              </Typography>
              <Slider
                value={values.customVariantSettings?.padding || 2}
                onChange={(e, value) => setFieldValue("customVariantSettings.padding", value)}
                min={0}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          {tabValue === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Pair Info Colors</Typography>

              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.pairInfoBackgroundColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.pairInfoBackgroundColor", value)}
                defaultValue="#ffffff"
              />

              <ColorPickerField
                label="Text Color"
                value={values.customVariantSettings?.pairInfoTextColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.pairInfoTextColor", value)}
                defaultValue="#000000"
              />

              <ColorPickerField
                label="Border Color"
                value={values.customVariantSettings?.pairInfoBorderColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.pairInfoBorderColor", value)}
                defaultValue="#e0e0e0"
              />
            </Box>
          )}

          {tabValue === 4 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Trade Widget Colors</Typography>

              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.tradeWidgetBackgroundColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradeWidgetBackgroundColor", value)}
                defaultValue="#ffffff"
              />

              <ColorPickerField
                label="Text Color"
                value={values.customVariantSettings?.tradeWidgetTextColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradeWidgetTextColor", value)}
                defaultValue="#000000"
              />

              <ColorPickerField
                label="Border Color"
                value={values.customVariantSettings?.tradeWidgetBorderColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradeWidgetBorderColor", value)}
                defaultValue="#e0e0e0"
              />

              <ColorPickerField
                label="Button Color"
                value={values.customVariantSettings?.tradeWidgetButtonColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradeWidgetButtonColor", value)}
                defaultValue="#1976d2"
              />

              <ColorPickerField
                label="Button Text Color"
                value={values.customVariantSettings?.tradeWidgetButtonTextColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradeWidgetButtonTextColor", value)}
                defaultValue="#ffffff"
              />
            </Box>
          )}

          {tabValue === 5 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Trading Graph Colors</Typography>

              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.tradingGraphBackgroundColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradingGraphBackgroundColor", value)}
                defaultValue="#ffffff"
              />

              <ColorPickerField
                label="Border Color"
                value={values.customVariantSettings?.tradingGraphBorderColor || ""}
                onChange={(value) => setFieldValue("customVariantSettings.tradingGraphBorderColor", value)}
                defaultValue="#e0e0e0"
              />
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
}

const COMPONENT_ICONS = {
  pairInfo: InfoIcon,
  tradingGraph: TrendingUpIcon,
  tradeWidget: SwapHorizIcon,
};

const COMPONENT_LABELS = {
  pairInfo: "Pair Information",
  tradingGraph: "Trading Chart",
  tradeWidget: "Trade Widget",
};

interface DragDropComponentOrderProps {
  value: string[];
  onChange: (newOrder: string[]) => void;
}

function DragDropComponentOrder({ value, onChange }: DragDropComponentOrderProps) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...value];
    const draggedItem = newOrder[draggedIndex];

    newOrder.splice(draggedIndex, 1);

    newOrder.splice(dropIndex, 0, draggedItem);

    onChange(newOrder);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Box>
      <Typography
        variant={isSmallScreen ? "body1" : "subtitle1"}
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary
        }}
      >
        Component Order (Drag to reorder)
      </Typography>
      <Typography
        variant={isSmallScreen ? "caption" : "body2"}
        color="text.secondary"
        sx={{ mb: theme.spacing(2) }}
      >
        Drag and drop to change the order. Pair Info appears as horizontal strip, widgets as boxes.
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: theme.shape.borderRadius }}>
        <List sx={{ p: 0 }}>
          {value.map((componentType, index) => {
            const IconComponent = COMPONENT_ICONS[componentType as keyof typeof COMPONENT_ICONS];
            const label = COMPONENT_LABELS[componentType as keyof typeof COMPONENT_LABELS];
            const isPairInfo = componentType === 'pairInfo';

            return (
              <ListItem
                key={componentType}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  border: `${theme.spacing(0.125)} solid`,
                  borderColor: draggedIndex === index ? 'primary.main' : 'divider',
                  borderRadius: theme.shape.borderRadius,
                  mb: theme.spacing(1),
                  bgcolor: draggedIndex === index ? 'action.selected' : 'background.paper',
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.light',
                  },
                  transition: theme.transitions.create(['all'], {
                    duration: theme.transitions.duration.short,
                  }),
                  height: {
                    xs: isPairInfo ? theme.spacing(7) : theme.spacing(9),
                    sm: isPairInfo ? theme.spacing(8) : theme.spacing(10)
                  },
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  px: { xs: theme.spacing(1), sm: theme.spacing(2) },
                }}
              >
                <ListItemIcon sx={{ minWidth: theme.spacing(4) }}>
                  <DragIndicatorIcon
                    color="action"
                    fontSize={isSmallScreen ? "small" : "medium"}
                  />
                </ListItemIcon>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: theme.spacing(1), sm: theme.spacing(2) },
                  flex: 1
                }}>
                  <Paper
                    elevation={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: theme.spacing(4), sm: theme.spacing(5) },
                      height: { xs: theme.spacing(4), sm: theme.spacing(5) },
                      borderRadius: isPairInfo ? theme.shape.borderRadius : theme.spacing(1),
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  >
                    {IconComponent && <IconComponent fontSize={isSmallScreen ? "small" : "medium"} />}
                  </Paper>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant={isSmallScreen ? "body2" : "subtitle2"}
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.text.primary
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    >
                      Position {index + 1} • {isPairInfo ? 'Horizontal Strip' : 'Box Component'}
                    </Typography>
                  </Box>

                  <Paper
                    variant="outlined"
                    sx={{
                      width: { xs: theme.spacing(12), sm: theme.spacing(15) },
                      height: { xs: theme.spacing(4), sm: theme.spacing(5) },
                      borderRadius: theme.shape.borderRadius,
                      bgcolor: theme.palette.grey[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {isPairInfo ? (
                      <Box sx={{
                        width: '90%',
                        height: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
                        bgcolor: 'primary.main',
                        borderRadius: theme.spacing(0.25)
                      }} />
                    ) : (
                      <Box sx={{
                        width: {
                          xs: componentType === 'tradeWidget' ? theme.spacing(3.5) : theme.spacing(4.5),
                          sm: componentType === 'tradeWidget' ? theme.spacing(4.5) : theme.spacing(5.5)
                        },
                        height: { xs: theme.spacing(2.5), sm: theme.spacing(3) },
                        bgcolor: componentType === 'tradeWidget' ? 'secondary.main' : 'info.main',
                        borderRadius: theme.spacing(0.5)
                      }} />
                    )}
                  </Paper>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default function ExchangeSettingsForm({
  onCancel,
  onSave,
  onChange,
  settings,
  tokens,
  saveOnChange,
  showSaveButton,
  onValidate,
  activeChainIds,
}: ExchangeSettingsFormProps) {
  const handleSubmit = async (values: DexkitExchangeSettings) => {
    onSave(values);
  };

  const [chainId, setChainId] = useState<ChainId>(ChainId.Ethereum);
  const isMobile = useIsMobile();
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event: SelectChangeEvent<ChainId>) => {
    if (typeof event.target.value === "number") {
      setChainId(event.target.value);
    }
  };

  const [showSelectNetworks, setShowSelectNetworks] = useState(false);

  const handleShowSelectNetworks = () => {
    setShowSelectNetworks(true);
  };

  const handleCloseSelectNetworks = () => {
    setShowSelectNetworks(false);
  };

  const { formatMessage } = useIntl();

  const handleValidate = async (values: DexkitExchangeSettings) => {
    let errors: any = {};

    if (values.buyTokenPercentageFee && values.buyTokenPercentageFee > 10) {
      errors["buyTokenPercentageFee"] = formatMessage({
        id: "the.max.fee.is.ten.percent",
        defaultMessage: "The max fee is 10%",
      });
    }

    for (let chainId of values.availNetworks) {
      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].baseToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The base token is required on {chainName}",
          },
          { chainName: getChainName(chainId) }
        );

        setWith(
          errors,
          `defaultPairs.${String(chainId)}.baseToken`,
          error,
          Object
        );
      }

      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].quoteToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The quote token is required on {chainName}",
          },
          { chainName: getChainName(chainId) }
        );

        setWith(
          errors,
          `defaultPairs.${String(chainId)}.quoteToken`,
          error,
          Object
        );
      }
      if (
        values?.defaultSlippage &&
        values?.defaultSlippage[chainId] &&
        values?.defaultSlippage[chainId].slippage > 50
      ) {
        let error = formatMessage({
          id: "max.slippage.is.value.percent",
          defaultMessage: "Max slippage is 50 percent",
        });

        setWith(
          errors,
          `defaultSlippage.${String(chainId)}.slippage`,
          error,
          Object
        );
      }
    }

    return errors;
  };

  const getInitialTokens = useCallback(() => {
    const resQuote = QUOTE_TOKENS_SUGGESTION.map((t) => {
      return { chainId: t.chainId, token: t };
    }).reduce(
      (prev, curr) => {
        let obj = { ...prev };

        if (!obj[curr.chainId]) {
          obj[curr.chainId] = { baseTokens: [], quoteTokens: [] };
        }

        let index = tokens.findIndex(
          (t) =>
            curr.token.chainId === t.chainId &&
            isAddressEqual(curr.token.address, t.address)
        );

        if (index > -1) {
          obj[curr.chainId].quoteTokens.push(curr.token);
        }

        return obj;
      },
      {} as { [key: number]: { quoteTokens: Token[]; baseTokens: Token[] } }
    );

    for (let chain of Object.keys(NETWORKS)) {
      let chainId = parseChainId(chain);

      if (resQuote[chainId]) {
        let chainTokens = tokens.filter((t) => t.chainId === chainId);

        for (let token of chainTokens) {
          let index = resQuote[chainId].quoteTokens.findIndex(
            (t) =>
              t.chainId === token.chainId &&
              isAddressEqual(t.address, token.address)
          );

          if (index === -1) {
            resQuote[chainId].baseTokens.push(token);
          }
        }
      } else {
        resQuote[chainId] = { baseTokens: [], quoteTokens: [] };
      }
    }

    return resQuote;
  }, [tokens]);

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((k) => activeChainIds.includes(Number(k)))
      .filter((key) => {
        let chain = parseChainId(key);

        return NETWORKS[chain].testnet === undefined;
      })
      .map((key) => NETWORKS[parseChainId(key)]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <Formik
          initialValues={
            settings
              ? settings
              : {
                defaultNetwork: ChainId.Ethereum,
                defaultPairs: DEFAULT_TOKENS,
                quoteTokens: [],
                defaultTokens: getInitialTokens(),
                affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
                defaultSlippage: {},
                zrxApiKey: "",
                buyTokenPercentageFee: 0.0,
                availNetworks: networks.map((n) => n.chainId),
                variant: "default" as ExchangeVariant,
                customVariantSettings: {
                  showPairInfo: true,
                  showTradingGraph: true,
                  showTradeWidget: true,
                  layout: "grid",
                  spacing: 2,
                  backgroundColor: "",
                  borderRadius: 0,
                  padding: 2,
                  componentOrder: ['pairInfo', 'tradeWidget', 'tradingGraph'],
                  pairInfoBackgroundColor: "",
                  pairInfoTextColor: "",
                  pairInfoBorderColor: "",
                  tradeWidgetBackgroundColor: "",
                  tradeWidgetTextColor: "",
                  tradeWidgetBorderColor: "",
                  tradeWidgetButtonColor: "",
                  tradeWidgetButtonTextColor: "",
                  tradingGraphBackgroundColor: "",
                  tradingGraphBorderColor: "",
                },
              }
          }
          onSubmit={handleSubmit}
          validationSchema={ExchangeSettingsSchema}
          validateOnChange
          validate={handleValidate}
        >
          {({ submitForm, values, errors, setFieldValue }) => (
            <>
              <SelectNetworksDialog
                DialogProps={{
                  open: showSelectNetworks,
                  maxWidth: "sm",
                  fullWidth: true,
                  onClose: handleCloseSelectNetworks,
                }}
                activeChainIds={activeChainIds}
              />
              {saveOnChange && onChange && (
                <SaveOnChangeListener onSave={onChange} onValidate={onValidate} />
              )}
              <Grid container spacing={isMobile ? 1.5 : 2}>
                {/* <Grid item xs={12}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="0x.api.key"
                    defaultMessage="0x Api Key"
                  />
                }
                name="zrxApiKey"
                fullWidth
              />
            </Grid> */}

                <Grid item xs={12}>
                  <Paper sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Stack spacing={isMobile ? 1.5 : 2}>
                      <Field
                        component={FormikSelect}
                        label={
                          <FormattedMessage
                            id="default.network"
                            defaultMessage="Default network"
                          />
                        }
                        name="defaultNetwork"
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        renderValue={(value: ChainId) => {
                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              alignContent="center"
                              spacing={1}
                            >
                              <Avatar
                                src={ipfsUriToUrl(NETWORKS[value].imageUrl || "")}
                                style={{ width: "auto", height: isMobile ? "0.85rem" : "1rem" }}
                              />
                              <Typography variant={isMobile ? "body2" : "body1"}>
                                {NETWORKS[value].name}
                              </Typography>
                            </Stack>
                          );
                        }}
                      >
                        {networks.map((n) => (
                          <MenuItem key={n.chainId} value={n.chainId}>
                            <ListItemIcon>
                              <Avatar
                                src={ipfsUriToUrl(
                                  NETWORKS[n.chainId].imageUrl || ""
                                )}
                                style={{ width: isMobile ? "0.85rem" : "1rem", height: isMobile ? "0.85rem" : "1rem" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={n.name}
                              primaryTypographyProps={{
                                variant: isMobile ? "body2" : "body1"
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Field>
                      <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        direction="row"
                      >
                        <Typography variant={isMobile ? "caption" : "subtitle2"}>
                          <FormattedMessage
                            id="choose.the.networks.that.your.exchange.will.be.enabled"
                            defaultMessage="Choose the networks that your exchange will be enabled"
                          />
                        </Typography>
                        {values.availNetworks.length > 0 && (
                          <Tooltip
                            title={
                              <FormattedMessage
                                id="edit.networks"
                                defaultMessage="Edit Networks"
                              />
                            }
                          >
                            <IconButton
                              onClick={handleShowSelectNetworks}
                              size="small"
                            >
                              <Edit fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                      <Divider />
                      <Box>
                        <Grid container spacing={isMobile ? 1 : 2}>
                          {values.availNetworks.length > 0 ? (
                            networks
                              .filter((network) =>
                                values.availNetworks.includes(network.chainId)
                              )
                              .map((n) => (
                                <Grid item key={n.chainId}>
                                  <Chip
                                    size="small"
                                    avatar={
                                      <Avatar
                                        src={ipfsUriToUrl(
                                          NETWORKS[n.chainId].imageUrl || ""
                                        )}
                                      />
                                    }
                                    label={n.name}
                                  />
                                </Grid>
                              ))
                          ) : (
                            <Grid item xs={12}>
                              <Box>
                                <Stack spacing={isMobile ? 1 : 2} alignItems="center">
                                  <Typography
                                    variant={isMobile ? "caption" : "body2"}
                                    color="text.secondary"
                                  >
                                    <FormattedMessage
                                      id="No.networks.selected"
                                      defaultMessage="No networks selected"
                                    />
                                  </Typography>
                                  <Button
                                    onClick={handleShowSelectNetworks}
                                    variant="outlined"
                                    size={isMobile ? "small" : "medium"}
                                  >
                                    <FormattedMessage
                                      id="select.networks"
                                      defaultMessage="Select networks"
                                    />
                                  </Button>
                                </Stack>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Grid container spacing={isMobile ? 1.5 : 2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                          <InputLabel>
                            <FormattedMessage
                              id="network"
                              defaultMessage="Network"
                            />
                          </InputLabel>
                          <Select
                            disabled={values.availNetworks.length === 0}
                            label={
                              <FormattedMessage
                                id="network"
                                defaultMessage="Network"
                              />
                            }
                            fullWidth
                            value={chainId}
                            onChange={handleChange}
                            renderValue={(value) => {
                              return (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  alignContent="center"
                                  spacing={1}
                                >
                                  <Avatar
                                    src={ipfsUriToUrl(
                                      NETWORKS[value].imageUrl || ""
                                    )}
                                    style={{ width: "auto", height: isMobile ? "0.85rem" : "1rem" }}
                                  />
                                  <Typography variant={isMobile ? "body2" : "body1"}>
                                    {NETWORKS[value].name}
                                  </Typography>
                                </Stack>
                              );
                            }}
                          >
                            {networks
                              .filter((n) =>
                                values.availNetworks.includes(n.chainId)
                              )
                              .map((n) => (
                                <MenuItem key={n.chainId} value={n.chainId}>
                                  <ListItemIcon>
                                    <Avatar
                                      src={ipfsUriToUrl(
                                        NETWORKS[n.chainId].imageUrl || ""
                                      )}
                                      style={{ width: isMobile ? "0.85rem" : "1rem", height: isMobile ? "0.85rem" : "1rem" }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={n.name}
                                    primaryTypographyProps={{
                                      variant: isMobile ? "body2" : "body1"
                                    }}
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText>
                            <Typography variant={isMobile ? "caption" : "body2"}>
                              <FormattedMessage
                                id="define.the.tokens.and.the.default.pair.for.this.network"
                                defaultMessage="Define the tokens and the default pair for this network"
                              />
                            </Typography>
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <ExchangeQuoteTokensInput
                          tokens={tokens}
                          chainId={chainId}
                          label={
                            <FormattedMessage
                              id="quote.tokens"
                              defaultMessage="Quote tokens"
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ExchangeTokenInput
                          name={`defaultPairs[${chainId}].baseToken`}
                          tokens={
                            getIn(values, `defaultTokens.${chainId}.baseTokens`) ||
                            []
                          }
                          label={
                            <FormattedMessage
                              id="base.token"
                              defaultMessage="Base token"
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ExchangeTokenInput
                          name={`defaultPairs[${chainId}].quoteToken`}
                          tokens={
                            getIn(values, `defaultTokens.${chainId}.quoteTokens`) ||
                            []
                          }
                          label={
                            <FormattedMessage
                              id="quote.token"
                              defaultMessage="Quote token"
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextFieldMui
                          inputProps={{
                            type: "number",
                            min: 0,
                            max: 50,
                            step: 0.01,
                          }}
                          InputLabelProps={{ shrink: true }}
                          label={
                            <FormattedMessage
                              id="default.slippage.percentage"
                              defaultMessage="Default slippage (0-50%)"
                            />
                          }
                          value={
                            getIn(values, `defaultSlippage.${chainId}.slippage`) ||
                            1
                          }
                          onChange={(event: any) => {
                            let value = event.target.value;
                            if (value < 0) {
                              value = 0;
                            }
                            if (value > 50) {
                              value = 50;
                            }
                            setFieldValue(
                              `defaultSlippage.${chainId}.slippage`,
                              value
                            );
                          }}
                          fullWidth
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <VariantConfigurationTab />
                </Grid>

                <Grid item xs={12} sm={isSmallDevice ? 12 : 9}>
                  <Field
                    component={TextField}
                    label={
                      <FormattedMessage
                        id="fee.recipient.address"
                        defaultMessage="Fee recipient address"
                      />
                    }
                    fullWidth
                    name="feeRecipientAddress"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>

                <Grid item xs={12} sm={isSmallDevice ? 12 : 3}>
                  <FormikDecimalInput
                    name="buyTokenPercentageFee"
                    decimals={2}
                    maxDigits={3}
                    TextFieldProps={{
                      fullWidth: true,
                      label: (
                        <FormattedMessage
                          id="fee.amount"
                          defaultMessage="Fee amount"
                        />
                      ),
                      InputProps: {
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      },
                      size: isMobile ? "small" : "medium",
                    }}
                  />
                </Grid>
                {showSaveButton && (
                  <FormActions
                    onSubmit={submitForm}
                    onCancel={onCancel}
                    isSmallDevice={isSmallDevice}
                    isMobile={isMobile}
                  />
                )}
              </Grid>
            </>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
