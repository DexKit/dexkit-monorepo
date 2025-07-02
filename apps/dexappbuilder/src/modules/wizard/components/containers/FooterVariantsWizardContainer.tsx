import {
  AppConfig,
  SiteResponse,
} from '@dexkit/ui/modules/wizard/types/config';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import {
  CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  WIDGET_SIGNATURE_FEAT,
} from '@dexkit/ui/constants/featPayments';
import { useActiveFeatUsage } from '@dexkit/ui/hooks/payments';

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

function getAllPositions(): Array<{ value: string; labelId: string; defaultMessage: string }> {
  return [
    { value: 'left', labelId: 'footer.position.left', defaultMessage: 'Left' },
    { value: 'center', labelId: 'footer.position.center', defaultMessage: 'Center' },
    { value: 'right', labelId: 'footer.position.right', defaultMessage: 'Right' }
  ];
}

function validateUniquePositions(
  signaturePosition: string,
  menuPosition: string,
  socialMediaPosition: string
): boolean {
  const positions = [signaturePosition, menuPosition, socialMediaPosition];
  const uniquePositions = new Set(positions);
  return uniquePositions.size === positions.length;
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

interface FooterConfig {
  variant?: 'default' | 'glassmorphic' | 'minimal' | 'invisible' | 'custom';
  glassConfig?: {
    blurIntensity?: number;
    glassOpacity?: number;
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
  };
  minimalConfig?: {
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    fontSize?: number;
    showDividers?: boolean;
    spacing?: number;
  };
  invisibleConfig?: {
    textColor?: string;
    fontSize?: number;
    spacing?: number;
    alignment?: 'left' | 'center' | 'right';
    showOnlySignature?: boolean;
  };
  customConfig?: {
    backgroundColor?: string;
    backgroundType?: 'solid' | 'gradient' | 'image';
    gradientDirection?: string;
    gradientColors?: string[];
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
    backgroundBlur?: number;
    padding?: number;
    borderRadius?: number;
    logo?: {
      url?: string;
      width?: number;
      height?: number;
      position?: {
        x: number;
        y: number;
      };
    };
    columns?: {
      id: string;
      title: string;
      titleStyle?: {
        fontSize?: number;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
        textDecoration?: 'none' | 'underline';
        color?: string;
      };
      links: {
        id: string;
        text: string;
        url: string;
        style?: {
          fontSize?: number;
          color?: string;
          hoverColor?: string;
          fontWeight?: 'normal' | 'bold';
          fontStyle?: 'normal' | 'italic';
        };
      }[];
      position?: {
        x: number;
        y: number;
        width?: number;
      };
    }[];
    menu?: {
      position?: {
        x: number;
        y: number;
      };
      style?: {
        fontSize?: number;
        color?: string;
        hoverColor?: string;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
        spacing?: number;
        direction?: 'horizontal' | 'vertical';
      };
    };
    socialMedia?: {
      position?: {
        x: number;
        y: number;
      };
      iconSize?: number;
      iconColor?: string;
      iconHoverColor?: string;
    };
    signature?: {
      position?: {
        x: number;
        y: number;
      };
      style?: {
        fontSize?: number;
        color?: string;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
      };
    };
  };
  customSignature?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    showAppName?: boolean;
    showLoveBy?: boolean;
  };
  layout?: {
    signaturePosition?: 'left' | 'center' | 'right';
    menuPosition?: 'left' | 'center' | 'right';
    socialMediaPosition?: 'left' | 'center' | 'right';
    borderRadius?: number;
  };
}

interface Props {
  site?: SiteResponse | null;
  isWidget?: boolean;
  config: AppConfig & { footerConfig?: FooterConfig };
  onSave: (config: AppConfig & { footerConfig?: FooterConfig }) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

const FooterConfigSchema = Yup.object().shape({
  variant: Yup.string().oneOf(['default', 'glassmorphic', 'minimal', 'invisible', 'custom']),
  glassConfig: Yup.object().shape({
    blurIntensity: Yup.number().min(10).max(60),
    glassOpacity: Yup.number().min(0.05).max(0.5),
    backgroundColor: Yup.string(),
    textColor: Yup.string(),
    backgroundImage: Yup.string(),
    backgroundSize: Yup.string(),
    backgroundPosition: Yup.string(),
    backgroundRepeat: Yup.string(),
    backgroundAttachment: Yup.string(),
  }),
  minimalConfig: Yup.object().shape({
    backgroundColor: Yup.string(),
    textColor: Yup.string(),
    dividerColor: Yup.string(),
    fontSize: Yup.number().min(10).max(24),
    showDividers: Yup.boolean(),
    spacing: Yup.number().min(0.5).max(4),
  }),
  invisibleConfig: Yup.object().shape({
    textColor: Yup.string(),
    fontSize: Yup.number().min(8).max(16),
    spacing: Yup.number().min(0).max(2),
    alignment: Yup.string().oneOf(['left', 'center', 'right']),
    showOnlySignature: Yup.boolean(),
  }),
  customConfig: Yup.object().shape({
    backgroundColor: Yup.string(),
    backgroundType: Yup.string().oneOf(['solid', 'gradient', 'image']),
    gradientDirection: Yup.string(),
    gradientColors: Yup.array().of(Yup.string()),
    backgroundImage: Yup.string(),
    backgroundSize: Yup.string(),
    backgroundPosition: Yup.string(),
    backgroundRepeat: Yup.string(),
    backgroundAttachment: Yup.string(),
    backgroundBlur: Yup.number().min(0).max(20),
    padding: Yup.number().min(0).max(8),
    borderRadius: Yup.number().min(0).max(50),
    logo: Yup.object().shape({
      url: Yup.string(),
      width: Yup.number().min(10).max(500),
      height: Yup.number().min(10).max(500),
      position: Yup.object().shape({
        x: Yup.number().min(0).max(90),
        y: Yup.number().min(0).max(90),
      }),
    }),
    columns: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        title: Yup.string().required(),
        titleStyle: Yup.object().shape({
          fontSize: Yup.number().min(8).max(32),
          fontWeight: Yup.string().oneOf(['normal', 'bold']),
          fontStyle: Yup.string().oneOf(['normal', 'italic']),
          textDecoration: Yup.string().oneOf(['none', 'underline']),
          color: Yup.string(),
        }),
        links: Yup.array().of(
          Yup.object().shape({
            id: Yup.string().required(),
            text: Yup.string().required(),
            url: Yup.string().required(),
            style: Yup.object().shape({
              fontSize: Yup.number().min(8).max(24),
              color: Yup.string(),
              hoverColor: Yup.string(),
              fontWeight: Yup.string().oneOf(['normal', 'bold']),
              fontStyle: Yup.string().oneOf(['normal', 'italic']),
            }),
          })
        ),
        position: Yup.object().shape({
          x: Yup.number().min(0).max(80),
          y: Yup.number().min(0).max(70),
          width: Yup.number().min(15).max(40),
        }),
      })
    ),
    menu: Yup.object().shape({
      position: Yup.object().shape({
        x: Yup.number().min(0).max(80),
        y: Yup.number().min(0).max(85),
      }),
      style: Yup.object().shape({
        fontSize: Yup.number().min(12).max(20),
        color: Yup.string(),
        hoverColor: Yup.string(),
        fontWeight: Yup.string().oneOf(['normal', 'bold']),
        fontStyle: Yup.string().oneOf(['normal', 'italic']),
        spacing: Yup.number().min(1).max(4),
        direction: Yup.string().oneOf(['horizontal', 'vertical']),
      }),
    }),
    socialMedia: Yup.object().shape({
      position: Yup.object().shape({
        x: Yup.number().min(60).max(85),
        y: Yup.number().min(10).max(80),
      }),
      iconSize: Yup.number().min(16).max(64),
      iconColor: Yup.string(),
      iconHoverColor: Yup.string(),
    }),
    signature: Yup.object().shape({
      position: Yup.object().shape({
        x: Yup.number().min(0).max(60),
        y: Yup.number().min(70).max(85),
      }),
      style: Yup.object().shape({
        fontSize: Yup.number().min(8).max(24),
        color: Yup.string(),
        fontWeight: Yup.string().oneOf(['normal', 'bold']),
        fontStyle: Yup.string().oneOf(['normal', 'italic']),
      }),
    }),
  }),
  customSignature: Yup.object().shape({
    enabled: Yup.boolean(),
    text: Yup.string(),
    link: Yup.string().url(),
    showAppName: Yup.boolean(),
    showLoveBy: Yup.boolean(),
  }),
  layout: Yup.object().shape({
    signaturePosition: Yup.string().oneOf(['left', 'center', 'right']),
    menuPosition: Yup.string().oneOf(['left', 'center', 'right']),
    socialMediaPosition: Yup.string().oneOf(['left', 'center', 'right']),
    borderRadius: Yup.number().min(0).max(50),
  }).test('unique-positions', 'All positions must be unique', function (value) {
    if (!value) return true;
    return validateUniquePositions(
      value.signaturePosition || 'left',
      value.menuPosition || 'center',
      value.socialMediaPosition || 'right'
    );
  }),
});

function BackgroundImageSelector({
  value,
  onChange,
  sizeValue,
  onSizeChange,
  positionValue,
  onPositionChange,
  repeatValue,
  onRepeatChange,
  attachmentValue,
  onAttachmentChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  sizeValue?: string;
  onSizeChange: (size: string) => void;
  positionValue?: string;
  onPositionChange: (position: string) => void;
  repeatValue?: string;
  onRepeatChange: (repeat: string) => void;
  attachmentValue?: string;
  onAttachmentChange: (attachment: string) => void;
}) {
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const theme = useTheme();

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
          id="footer.background.image"
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
                  id="footer.select.background.image"
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
            onClick={handleRemoveImage}
          >
            <FormattedMessage
              id="remove.image"
              defaultMessage="Remove Image"
            />
          </Button>
        )}
      </Box>

      {value && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.size"
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
                      id="footer.background.size.cover"
                      defaultMessage="Cover (Fill container)"
                    />
                  </MenuItem>
                  <MenuItem value="contain">
                    <FormattedMessage
                      id="footer.background.size.contain"
                      defaultMessage="Contain (Fit inside)"
                    />
                  </MenuItem>
                  <MenuItem value="auto">
                    <FormattedMessage
                      id="footer.background.size.auto"
                      defaultMessage="Auto (Original size)"
                    />
                  </MenuItem>
                  <MenuItem value="100% 100%">
                    <FormattedMessage
                      id="footer.background.size.stretch"
                      defaultMessage="Stretch (Fill exactly)"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.position"
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
                      id="footer.background.position.center"
                      defaultMessage="Center"
                    />
                  </MenuItem>
                  <MenuItem value="top">
                    <FormattedMessage
                      id="footer.background.position.top"
                      defaultMessage="Top"
                    />
                  </MenuItem>
                  <MenuItem value="bottom">
                    <FormattedMessage
                      id="footer.background.position.bottom"
                      defaultMessage="Bottom"
                    />
                  </MenuItem>
                  <MenuItem value="left">
                    <FormattedMessage
                      id="footer.background.position.left"
                      defaultMessage="Left"
                    />
                  </MenuItem>
                  <MenuItem value="right">
                    <FormattedMessage
                      id="footer.background.position.right"
                      defaultMessage="Right"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.repeat"
                    defaultMessage="Image Repeat"
                  />
                </InputLabel>
                <Select
                  value={repeatValue || "no-repeat"}
                  onChange={(e) => onRepeatChange(e.target.value as string)}
                  label="Image Repeat"
                >
                  <MenuItem value="no-repeat">
                    <FormattedMessage
                      id="footer.background.repeat.no"
                      defaultMessage="No repeat"
                    />
                  </MenuItem>
                  <MenuItem value="repeat">
                    <FormattedMessage
                      id="footer.background.repeat.yes"
                      defaultMessage="Repeat"
                    />
                  </MenuItem>
                  <MenuItem value="repeat-x">
                    <FormattedMessage
                      id="footer.background.repeat.x"
                      defaultMessage="Repeat horizontally"
                    />
                  </MenuItem>
                  <MenuItem value="repeat-y">
                    <FormattedMessage
                      id="footer.background.repeat.y"
                      defaultMessage="Repeat vertically"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.attachment"
                    defaultMessage="Image Attachment"
                  />
                </InputLabel>
                <Select
                  value={attachmentValue || "scroll"}
                  onChange={(e) => onAttachmentChange(e.target.value as string)}
                  label="Image Attachment"
                >
                  <MenuItem value="scroll">
                    <FormattedMessage
                      id="footer.background.attachment.scroll"
                      defaultMessage="Scroll (Normal)"
                    />
                  </MenuItem>
                  <MenuItem value="fixed">
                    <FormattedMessage
                      id="footer.background.attachment.fixed"
                      defaultMessage="Fixed (Parallax)"
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

export default function FooterVariantsWizardContainer({
  config,
  onSave,
  isWidget,
  onHasChanges,
  site,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();

  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: isWidget ? WIDGET_SIGNATURE_FEAT : CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  });

  const isPaid = activeFeatUsageQuery.data
    ? activeFeatUsageQuery?.data?.active
    : undefined;

  const initialValues = {
    variant: config.footerConfig?.variant || 'default',
    glassConfig: {
      blurIntensity: config.footerConfig?.glassConfig?.blurIntensity || 40,
      glassOpacity: config.footerConfig?.glassConfig?.glassOpacity || 0.10,
      backgroundColor: config.footerConfig?.glassConfig?.backgroundColor || '',
      textColor: config.footerConfig?.glassConfig?.textColor || theme.palette.text.primary,
      backgroundImage: config.footerConfig?.glassConfig?.backgroundImage || '',
      backgroundSize: config.footerConfig?.glassConfig?.backgroundSize || 'cover',
      backgroundPosition: config.footerConfig?.glassConfig?.backgroundPosition || 'center',
      backgroundRepeat: config.footerConfig?.glassConfig?.backgroundRepeat || 'no-repeat',
      backgroundAttachment: config.footerConfig?.glassConfig?.backgroundAttachment || 'scroll',
    },
    minimalConfig: {
      backgroundColor: config.footerConfig?.minimalConfig?.backgroundColor || '',
      textColor: config.footerConfig?.minimalConfig?.textColor || theme.palette.text.secondary,
      dividerColor: config.footerConfig?.minimalConfig?.dividerColor || theme.palette.divider,
      fontSize: config.footerConfig?.minimalConfig?.fontSize || 14,
      showDividers: config.footerConfig?.minimalConfig?.showDividers ?? true,
      spacing: config.footerConfig?.minimalConfig?.spacing || 1,
    },
    invisibleConfig: {
      textColor: config.footerConfig?.invisibleConfig?.textColor || theme.palette.text.disabled,
      fontSize: config.footerConfig?.invisibleConfig?.fontSize || 12,
      spacing: config.footerConfig?.invisibleConfig?.spacing || 0.5,
      alignment: config.footerConfig?.invisibleConfig?.alignment || 'center',
      showOnlySignature: config.footerConfig?.invisibleConfig?.showOnlySignature || false,
    },
    customConfig: {
      backgroundColor: config.footerConfig?.customConfig?.backgroundColor || '#ffffff',
      backgroundType: config.footerConfig?.customConfig?.backgroundType || 'solid',
      gradientDirection: config.footerConfig?.customConfig?.gradientDirection || '45deg',
      gradientColors: config.footerConfig?.customConfig?.gradientColors || ['#ff6b6b', '#4ecdc4'],
      backgroundImage: config.footerConfig?.customConfig?.backgroundImage || '',
      backgroundSize: config.footerConfig?.customConfig?.backgroundSize || 'cover',
      backgroundPosition: config.footerConfig?.customConfig?.backgroundPosition || 'center',
      backgroundRepeat: config.footerConfig?.customConfig?.backgroundRepeat || 'no-repeat',
      backgroundAttachment: config.footerConfig?.customConfig?.backgroundAttachment || 'scroll',
      backgroundBlur: config.footerConfig?.customConfig?.backgroundBlur || 0,
      padding: config.footerConfig?.customConfig?.padding || 4,
      borderRadius: config.footerConfig?.customConfig?.borderRadius || 0,
      logo: {
        url: config.footerConfig?.customConfig?.logo?.url || '',
        width: config.footerConfig?.customConfig?.logo?.width || 100,
        height: config.footerConfig?.customConfig?.logo?.height || 50,
        position: {
          x: config.footerConfig?.customConfig?.logo?.position?.x || 10,
          y: config.footerConfig?.customConfig?.logo?.position?.y || 10,
        },
      },
      columns: config.footerConfig?.customConfig?.columns || [],
      menu: {
        position: { x: 5, y: 40 },
        style: {
          fontSize: config.footerConfig?.customConfig?.menu?.style?.fontSize || 14,
          color: config.footerConfig?.customConfig?.menu?.style?.color || '#333333',
          hoverColor: config.footerConfig?.customConfig?.menu?.style?.hoverColor || theme.palette.primary.main,
          fontWeight: config.footerConfig?.customConfig?.menu?.style?.fontWeight || 'normal',
          fontStyle: config.footerConfig?.customConfig?.menu?.style?.fontStyle || 'normal',
          spacing: config.footerConfig?.customConfig?.menu?.style?.spacing || 2,
          direction: config.footerConfig?.customConfig?.menu?.style?.direction || 'vertical',
          ...config.footerConfig?.customConfig?.menu?.style,
        },
        ...config.footerConfig?.customConfig?.menu,
      },
      socialMedia: {
        position: { x: 75, y: 70 },
        iconSize: config.footerConfig?.customConfig?.socialMedia?.iconSize || 24,
        iconColor: config.footerConfig?.customConfig?.socialMedia?.iconColor || '#333333',
        iconHoverColor: config.footerConfig?.customConfig?.socialMedia?.iconHoverColor || theme.palette.primary.main,
        ...config.footerConfig?.customConfig?.socialMedia,
      },
      signature: {
        position: { x: 10, y: 80 },
        style: {
          fontSize: config.footerConfig?.customConfig?.signature?.style?.fontSize || 14,
          color: config.footerConfig?.customConfig?.signature?.style?.color || '#666666',
          fontWeight: config.footerConfig?.customConfig?.signature?.style?.fontWeight || 'normal',
          fontStyle: config.footerConfig?.customConfig?.signature?.style?.fontStyle || 'normal',
          ...config.footerConfig?.customConfig?.signature?.style,
        },
        ...config.footerConfig?.customConfig?.signature,
      },
    },
    customSignature: {
      enabled: config.footerConfig?.customSignature?.enabled || false,
      text: config.footerConfig?.customSignature?.text || 'DexKit',
      link: config.footerConfig?.customSignature?.link || 'https://www.dexkit.com',
      showAppName: config.footerConfig?.customSignature?.showAppName ?? true,
      showLoveBy: config.footerConfig?.customSignature?.showLoveBy ?? true,
    },
    layout: {
      signaturePosition: config.footerConfig?.layout?.signaturePosition || 'left',
      menuPosition: config.footerConfig?.layout?.menuPosition || 'center',
      socialMediaPosition: config.footerConfig?.layout?.socialMediaPosition || 'right',
      borderRadius: config.footerConfig?.layout?.borderRadius || 0,
    },
  };

  const [hasChanged, setHasChanged] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [showLogoMediaDialog, setShowLogoMediaDialog] = useState(false);
  const [currentSetFieldValue, setCurrentSetFieldValue] = useState<((field: string, value: any) => void) | null>(null);

  useEffect(() => {
    const currentConfig = {
      variant: formValues.variant,
      glassConfig: formValues.glassConfig,
      minimalConfig: formValues.minimalConfig,
      invisibleConfig: formValues.invisibleConfig,
      customConfig: formValues.customConfig,
      customSignature: formValues.customSignature,
      layout: formValues.layout,
    };

    const originalConfig = {
      variant: config.footerConfig?.variant || 'default',
      glassConfig: config.footerConfig?.glassConfig || initialValues.glassConfig,
      minimalConfig: config.footerConfig?.minimalConfig || initialValues.minimalConfig,
      invisibleConfig: config.footerConfig?.invisibleConfig || initialValues.invisibleConfig,
      customConfig: config.footerConfig?.customConfig || initialValues.customConfig,
      customSignature: config.footerConfig?.customSignature || initialValues.customSignature,
      layout: config.footerConfig?.layout || initialValues.layout,
    };

    const variantChanged = currentConfig.variant !== originalConfig.variant;
    const configChanged = JSON.stringify(currentConfig) !== JSON.stringify(originalConfig);

    setHasChanged(variantChanged || configChanged);
  }, [formValues, config.footerConfig, initialValues]);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid item xs={12}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={FooterConfigSchema}
          onSubmit={(values) => {
            const newConfig = {
              ...config,
              footerConfig: {
                variant: values.variant as 'default' | 'glassmorphic' | 'minimal' | 'invisible' | 'custom',
                glassConfig: values.glassConfig,
                minimalConfig: values.minimalConfig,
                invisibleConfig: values.invisibleConfig,
                customConfig: values.customConfig,
                customSignature: values.customSignature,
                layout: values.layout,
              },
            };
            onSave(newConfig);
            setHasChanged(false);
          }}
        >
          {({ values, setFieldValue, submitForm }) => {
            if (currentSetFieldValue !== setFieldValue) {
              setCurrentSetFieldValue(() => setFieldValue);
            }

            if (!values.invisibleConfig) {
              setFieldValue('invisibleConfig', initialValues.invisibleConfig);
            }
            if (!values.minimalConfig) {
              setFieldValue('minimalConfig', initialValues.minimalConfig);
            }
            if (!values.glassConfig) {
              setFieldValue('glassConfig', initialValues.glassConfig);
            }
            if (!values.customConfig) {
              setFieldValue('customConfig', initialValues.customConfig);
            }
            if (!values.customConfig?.menu) {
              setFieldValue('customConfig.menu', initialValues.customConfig.menu);
            }

            if (JSON.stringify(values) !== JSON.stringify(formValues)) {
              setFormValues(values);
            }

            return (
              <Form>
                <Grid container spacing={isMobile ? 1.5 : 3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="footer.variant.select"
                          defaultMessage="Footer Variant"
                        />
                      </InputLabel>
                      <Select
                        value={values.variant}
                        onChange={(e) => setFieldValue('variant', e.target.value)}
                        label="Footer Variant"
                      >
                        <MenuItem value="default">
                          <FormattedMessage
                            id="footer.variant.default"
                            defaultMessage="Default - Classic footer style"
                          />
                        </MenuItem>
                        <MenuItem value="glassmorphic">
                          <FormattedMessage
                            id="footer.variant.glassmorphic"
                            defaultMessage="Glassmorphic - Modern glass effect"
                          />
                        </MenuItem>
                        <MenuItem value="minimal">
                          <FormattedMessage
                            id="footer.variant.minimal"
                            defaultMessage="Minimal - Clean and simple"
                          />
                        </MenuItem>
                        <MenuItem value="invisible">
                          <FormattedMessage
                            id="footer.variant.invisible"
                            defaultMessage="Invisible - Text only, no styling"
                          />
                        </MenuItem>
                        <MenuItem value="custom">
                          <FormattedMessage
                            id="footer.variant.custom"
                            defaultMessage="Custom - Full customization with columns and positioning"
                          />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {values.variant === 'glassmorphic' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.glassmorphic.settings"
                              defaultMessage="Glassmorphic Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.blur.intensity"
                                  defaultMessage="Blur Intensity"
                                />
                              </Typography>
                              <Slider
                                value={values.glassConfig.blurIntensity || 40}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  console.log('Blur intensity changed:', numericValue);
                                  setFieldValue('glassConfig.blurIntensity', numericValue);
                                }}
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
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.glass.opacity"
                                  defaultMessage="Glass Opacity"
                                />
                              </Typography>
                              <Slider
                                value={values.glassConfig.glassOpacity || 0.1}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  console.log('Glass opacity changed:', numericValue);
                                  setFieldValue('glassConfig.glassOpacity', numericValue);
                                }}
                                min={0.05}
                                max={0.5}
                                step={0.05}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0.05, label: '0.05' },
                                  { value: 0.25, label: '0.25' },
                                  { value: 0.5, label: '0.5' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.background.color",
                                  defaultMessage: "Background Color"
                                })}
                                value={values.glassConfig.backgroundColor}
                                onChange={(value) => setFieldValue('glassConfig.backgroundColor', value)}
                                defaultValue="rgba(255, 255, 255, 0.1)"
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.text.color",
                                  defaultMessage: "Text Color"
                                })}
                                value={values.glassConfig.textColor}
                                onChange={(value) => setFieldValue('glassConfig.textColor', value)}
                                defaultValue={theme.palette.text.primary}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <BackgroundImageSelector
                                value={values.glassConfig.backgroundImage}
                                onChange={(url) => setFieldValue('glassConfig.backgroundImage', url)}
                                sizeValue={values.glassConfig.backgroundSize}
                                onSizeChange={(size) => setFieldValue('glassConfig.backgroundSize', size)}
                                positionValue={values.glassConfig.backgroundPosition}
                                onPositionChange={(position) => setFieldValue('glassConfig.backgroundPosition', position)}
                                repeatValue={values.glassConfig.backgroundRepeat}
                                onRepeatChange={(repeat) => setFieldValue('glassConfig.backgroundRepeat', repeat)}
                                attachmentValue={values.glassConfig.backgroundAttachment}
                                onAttachmentChange={(attachment) => setFieldValue('glassConfig.backgroundAttachment', attachment)}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    setFieldValue('glassConfig', initialValues.glassConfig);
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
                                    id="reset.glassmorphic.settings"
                                    defaultMessage="Reset Glassmorphic Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'minimal' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.minimal.settings"
                              defaultMessage="Minimal Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.background.color",
                                  defaultMessage: "Background Color"
                                })}
                                value={values.minimalConfig.backgroundColor}
                                onChange={(value) => setFieldValue('minimalConfig.backgroundColor', value)}
                                defaultValue="transparent"
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.text.color",
                                  defaultMessage: "Text Color"
                                })}
                                value={values.minimalConfig.textColor}
                                onChange={(value) => setFieldValue('minimalConfig.textColor', value)}
                                defaultValue={theme.palette.text.secondary}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.divider.color",
                                  defaultMessage: "Divider Color"
                                })}
                                value={values.minimalConfig.dividerColor}
                                onChange={(value) => setFieldValue('minimalConfig.dividerColor', value)}
                                defaultValue={theme.palette.divider}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.font.size"
                                  defaultMessage="Font Size"
                                />
                              </Typography>
                              <Slider
                                value={values.minimalConfig.fontSize || 14}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('minimalConfig.fontSize', numericValue);
                                }}
                                min={10}
                                max={24}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 10, label: '10px' },
                                  { value: 14, label: '14px' },
                                  { value: 18, label: '18px' },
                                  { value: 24, label: '24px' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.spacing"
                                  defaultMessage="Spacing"
                                />
                              </Typography>
                              <Slider
                                value={values.minimalConfig.spacing || 1}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('minimalConfig.spacing', numericValue);
                                }}
                                min={0.5}
                                max={4}
                                step={0.5}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' },
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.minimalConfig.showDividers}
                                    onChange={(e) => setFieldValue('minimalConfig.showDividers', e.target.checked)}
                                  />
                                }
                                label={
                                  <FormattedMessage
                                    id="footer.show.dividers"
                                    defaultMessage="Show Dividers"
                                  />
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    setFieldValue('minimalConfig', initialValues.minimalConfig);
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
                                    id="reset.minimal.settings"
                                    defaultMessage="Reset Minimal Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'invisible' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.invisible.settings"
                              defaultMessage="Invisible Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.text.color",
                                  defaultMessage: "Text Color"
                                })}
                                value={values.invisibleConfig?.textColor || theme.palette.text.disabled}
                                onChange={(value) => setFieldValue('invisibleConfig.textColor', value)}
                                defaultValue={theme.palette.text.disabled}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.text.alignment"
                                    defaultMessage="Text Alignment"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.invisibleConfig?.alignment || 'center'}
                                  onChange={(e) => setFieldValue('invisibleConfig.alignment', e.target.value)}
                                  label="Text Alignment"
                                >
                                  <MenuItem value="left">
                                    <FormattedMessage
                                      id="footer.alignment.left"
                                      defaultMessage="Left"
                                    />
                                  </MenuItem>
                                  <MenuItem value="center">
                                    <FormattedMessage
                                      id="footer.alignment.center"
                                      defaultMessage="Center"
                                    />
                                  </MenuItem>
                                  <MenuItem value="right">
                                    <FormattedMessage
                                      id="footer.alignment.right"
                                      defaultMessage="Right"
                                    />
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.font.size"
                                  defaultMessage="Font Size"
                                />
                              </Typography>
                              <Slider
                                value={values.invisibleConfig?.fontSize || 12}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('invisibleConfig.fontSize', numericValue);
                                }}
                                min={8}
                                max={16}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 8, label: '8px' },
                                  { value: 10, label: '10px' },
                                  { value: 12, label: '12px' },
                                  { value: 14, label: '14px' },
                                  { value: 16, label: '16px' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.spacing"
                                  defaultMessage="Spacing"
                                />
                              </Typography>
                              <Slider
                                value={values.invisibleConfig?.spacing || 0.5}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('invisibleConfig.spacing', numericValue);
                                }}
                                min={0}
                                max={2}
                                step={0.25}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' },
                                  { value: 2, label: '2' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.invisibleConfig?.showOnlySignature || false}
                                    onChange={(e) => setFieldValue('invisibleConfig.showOnlySignature', e.target.checked)}
                                  />
                                }
                                label={
                                  <FormattedMessage
                                    id="footer.show.only.signature"
                                    defaultMessage="Show Only Signature (hide menu and social media)"
                                  />
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    setFieldValue('invisibleConfig', initialValues.invisibleConfig);
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
                                    id="reset.invisible.settings"
                                    defaultMessage="Reset Invisible Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'custom' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.background"
                              defaultMessage="Background Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.background.type"
                                    defaultMessage="Background Type"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.customConfig?.backgroundType || 'solid'}
                                  onChange={(e) => setFieldValue('customConfig.backgroundType', e.target.value)}
                                  label="Background Type"
                                >
                                  <MenuItem value="solid">
                                    <FormattedMessage
                                      id="footer.background.solid"
                                      defaultMessage="Solid Color"
                                    />
                                  </MenuItem>
                                  <MenuItem value="gradient">
                                    <FormattedMessage
                                      id="footer.background.gradient"
                                      defaultMessage="Gradient"
                                    />
                                  </MenuItem>
                                  <MenuItem value="image">
                                    <FormattedMessage
                                      id="footer.background.image"
                                      defaultMessage="Image"
                                    />
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            {(values.customConfig?.backgroundType === 'solid' || !values.customConfig?.backgroundType) && (
                              <Grid item xs={12} sm={6}>
                                <ColorPickerField
                                  label={formatMessage({
                                    id: "footer.background.color",
                                    defaultMessage: "Background Color"
                                  })}
                                  value={values.customConfig?.backgroundColor || '#ffffff'}
                                  onChange={(value) => setFieldValue('customConfig.backgroundColor', value)}
                                  defaultValue="#ffffff"
                                />
                              </Grid>
                            )}

                            {values.customConfig?.backgroundType === 'gradient' && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label={formatMessage({
                                      id: "footer.gradient.direction",
                                      defaultMessage: "Gradient Direction"
                                    })}
                                    value={values.customConfig?.gradientDirection || '45deg'}
                                    onChange={(e) => setFieldValue('customConfig.gradientDirection', e.target.value)}
                                    placeholder="45deg"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.gradient.color1",
                                      defaultMessage: "First Color"
                                    })}
                                    value={values.customConfig?.gradientColors?.[0] || '#ff6b6b'}
                                    onChange={(value) => {
                                      const colors = [...(values.customConfig?.gradientColors || ['#ff6b6b', '#4ecdc4'])];
                                      colors[0] = value;
                                      setFieldValue('customConfig.gradientColors', colors);
                                    }}
                                    defaultValue="#ff6b6b"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.gradient.color2",
                                      defaultMessage: "Second Color"
                                    })}
                                    value={values.customConfig?.gradientColors?.[1] || '#4ecdc4'}
                                    onChange={(value) => {
                                      const colors = [...(values.customConfig?.gradientColors || ['#ff6b6b', '#4ecdc4'])];
                                      colors[1] = value;
                                      setFieldValue('customConfig.gradientColors', colors);
                                    }}
                                    defaultValue="#4ecdc4"
                                  />
                                </Grid>
                              </>
                            )}

                            {values.customConfig?.backgroundType === 'image' && (
                              <Grid item xs={12}>
                                <BackgroundImageSelector
                                  value={values.customConfig?.backgroundImage}
                                  onChange={(url) => setFieldValue('customConfig.backgroundImage', url)}
                                  sizeValue={values.customConfig?.backgroundSize || 'cover'}
                                  onSizeChange={(size) => setFieldValue('customConfig.backgroundSize', size)}
                                  positionValue={values.customConfig?.backgroundPosition || 'center'}
                                  onPositionChange={(position) => setFieldValue('customConfig.backgroundPosition', position)}
                                  repeatValue={values.customConfig?.backgroundRepeat || 'no-repeat'}
                                  onRepeatChange={(repeat) => setFieldValue('customConfig.backgroundRepeat', repeat)}
                                  attachmentValue={values.customConfig?.backgroundAttachment || 'scroll'}
                                  onAttachmentChange={(attachment) => setFieldValue('customConfig.backgroundAttachment', attachment)}
                                />
                              </Grid>
                            )}

                            {(values.customConfig?.backgroundType === 'image' || values.customConfig?.backgroundType === 'gradient') && (
                              <Grid item xs={12} sm={6}>
                                <Typography gutterBottom>
                                  <FormattedMessage
                                    id="footer.background.blur"
                                    defaultMessage="Background Blur"
                                  />
                                </Typography>
                                <Slider
                                  value={values.customConfig?.backgroundBlur || 0}
                                  onChange={(_, value) => {
                                    const numericValue = Array.isArray(value) ? value[0] : value;
                                    setFieldValue('customConfig.backgroundBlur', numericValue);
                                  }}
                                  min={0}
                                  max={20}
                                  step={1}
                                  valueLabelDisplay="auto"
                                  valueLabelFormat={(value) => `${value}px`}
                                  marks={[
                                    { value: 0, label: '0px' },
                                    { value: 5, label: '5px' },
                                    { value: 10, label: '10px' },
                                    { value: 15, label: '15px' },
                                    { value: 20, label: '20px' },
                                  ]}
                                />
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                  <FormattedMessage
                                    id="footer.background.blur.help"
                                    defaultMessage="Difumina el fondo para que el texto sea más legible sobre imágenes complejas"
                                  />
                                </Typography>
                              </Grid>
                            )}

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.padding"
                                  defaultMessage="Padding"
                                />
                              </Typography>
                              <Slider
                                value={values.customConfig?.padding || 4}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('customConfig.padding', numericValue);
                                }}
                                min={0}
                                max={8}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                  { value: 6, label: '6' },
                                  { value: 8, label: '8' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.border.radius"
                                  defaultMessage="Border Radius"
                                />
                              </Typography>
                              <Slider
                                value={values.customConfig?.borderRadius || 0}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('customConfig.borderRadius', numericValue);
                                }}
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
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'custom' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.columns"
                              defaultMessage="Columns & Content"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                <FormattedMessage
                                  id="footer.columns.management"
                                  defaultMessage="Column Management"
                                />
                              </Typography>

                              {values.customConfig?.columns?.map((column, index) => (
                                <Box key={column.id} sx={{
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 2,
                                  p: 2,
                                  mb: 2,
                                  backgroundColor: theme.palette.background.paper
                                }}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                      {column.title || `Column ${index + 1}`}
                                    </Typography>
                                    <Button
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        const newColumns = [...(values.customConfig?.columns || [])];
                                        newColumns.splice(index, 1);
                                        setFieldValue('customConfig.columns', newColumns);
                                      }}
                                    >
                                      <FormattedMessage id="delete" defaultMessage="Delete" />
                                    </Button>
                                  </Stack>

                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                      <TextField
                                        fullWidth
                                        label={formatMessage({
                                          id: "footer.column.title",
                                          defaultMessage: "Column Title"
                                        })}
                                        value={column.title}
                                        onChange={(e) => {
                                          const newColumns = [...(values.customConfig?.columns || [])];
                                          newColumns[index] = { ...column, title: e.target.value };
                                          setFieldValue('customConfig.columns', newColumns);
                                        }}
                                      />
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                      <TextField
                                        fullWidth
                                        type="number"
                                        label={formatMessage({
                                          id: "footer.column.x.position",
                                          defaultMessage: "X Position (%)"
                                        })}
                                        value={column.position?.x || 0}
                                        onChange={(e) => {
                                          const newColumns = [...(values.customConfig?.columns || [])];
                                          newColumns[index] = {
                                            ...column,
                                            position: {
                                              ...column.position,
                                              x: parseInt(e.target.value) || 0,
                                              y: column.position?.y || 0,
                                              width: column.position?.width || 20
                                            }
                                          };
                                          setFieldValue('customConfig.columns', newColumns);
                                        }}
                                        inputProps={{ min: 0, max: 80 }}
                                      />
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                      <TextField
                                        fullWidth
                                        type="number"
                                        label={formatMessage({
                                          id: "footer.column.y.position",
                                          defaultMessage: "Y Position (%)"
                                        })}
                                        value={column.position?.y || 0}
                                        onChange={(e) => {
                                          const newColumns = [...(values.customConfig?.columns || [])];
                                          newColumns[index] = {
                                            ...column,
                                            position: {
                                              ...column.position,
                                              x: column.position?.x || 0,
                                              y: parseInt(e.target.value) || 0,
                                              width: column.position?.width || 20
                                            }
                                          };
                                          setFieldValue('customConfig.columns', newColumns);
                                        }}
                                        inputProps={{ min: 0, max: 70 }}
                                      />
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                      <TextField
                                        fullWidth
                                        type="number"
                                        label={formatMessage({
                                          id: "footer.column.width",
                                          defaultMessage: "Width (%)"
                                        })}
                                        value={column.position?.width || 20}
                                        onChange={(e) => {
                                          const newColumns = [...(values.customConfig?.columns || [])];
                                          newColumns[index] = {
                                            ...column,
                                            position: {
                                              ...column.position,
                                              x: column.position?.x || 0,
                                              y: column.position?.y || 0,
                                              width: parseInt(e.target.value) || 20
                                            }
                                          };
                                          setFieldValue('customConfig.columns', newColumns);
                                        }}
                                        inputProps={{ min: 15, max: 40 }}
                                        helperText={formatMessage({
                                          id: "footer.column.width.help",
                                          defaultMessage: "Controls the column width (15-40%)"
                                        })}
                                      />
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Typography variant="caption" sx={{ fontWeight: 'medium', mb: 1, display: 'block' }}>
                                        <FormattedMessage
                                          id="footer.column.title.style"
                                          defaultMessage="Title Style"
                                        />
                                      </Typography>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={2.4}>
                                          <TextField
                                            fullWidth
                                            type="number"
                                            size="small"
                                            label={formatMessage({
                                              id: "footer.font.size",
                                              defaultMessage: "Font Size"
                                            })}
                                            value={column.titleStyle?.fontSize || 16}
                                            onChange={(e) => {
                                              const newColumns = [...(values.customConfig?.columns || [])];
                                              newColumns[index] = {
                                                ...column,
                                                titleStyle: {
                                                  ...column.titleStyle,
                                                  fontSize: parseInt(e.target.value) || 16
                                                }
                                              };
                                              setFieldValue('customConfig.columns', newColumns);
                                            }}
                                            inputProps={{ min: 10, max: 24 }}
                                          />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={2.4}>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>Font Weight</InputLabel>
                                            <Select
                                              value={column.titleStyle?.fontWeight || 'normal'}
                                              onChange={(e) => {
                                                const newColumns = [...(values.customConfig?.columns || [])];
                                                newColumns[index] = {
                                                  ...column,
                                                  titleStyle: {
                                                    ...column.titleStyle,
                                                    fontWeight: e.target.value as 'normal' | 'bold'
                                                  }
                                                };
                                                setFieldValue('customConfig.columns', newColumns);
                                              }}
                                              label="Font Weight"
                                            >
                                              <MenuItem value="normal">Normal</MenuItem>
                                              <MenuItem value="bold">Bold</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={2.4}>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>Font Style</InputLabel>
                                            <Select
                                              value={column.titleStyle?.fontStyle || 'normal'}
                                              onChange={(e) => {
                                                const newColumns = [...(values.customConfig?.columns || [])];
                                                newColumns[index] = {
                                                  ...column,
                                                  titleStyle: {
                                                    ...column.titleStyle,
                                                    fontStyle: e.target.value as 'normal' | 'italic'
                                                  }
                                                };
                                                setFieldValue('customConfig.columns', newColumns);
                                              }}
                                              label="Font Style"
                                            >
                                              <MenuItem value="normal">Normal</MenuItem>
                                              <MenuItem value="italic">Italic</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={2.4}>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>
                                              <FormattedMessage
                                                id="footer.text.decoration"
                                                defaultMessage="Text Decoration"
                                              />
                                            </InputLabel>
                                            <Select
                                              value={column.titleStyle?.textDecoration || 'none'}
                                              onChange={(e) => {
                                                const newColumns = [...(values.customConfig?.columns || [])];
                                                newColumns[index] = {
                                                  ...column,
                                                  titleStyle: {
                                                    ...column.titleStyle,
                                                    textDecoration: e.target.value as 'none' | 'underline'
                                                  }
                                                };
                                                setFieldValue('customConfig.columns', newColumns);
                                              }}
                                              label="Text Decoration"
                                            >
                                              <MenuItem value="none">
                                                <FormattedMessage
                                                  id="footer.text.decoration.none"
                                                  defaultMessage="None"
                                                />
                                              </MenuItem>
                                              <MenuItem value="underline">
                                                <FormattedMessage
                                                  id="footer.text.decoration.underline"
                                                  defaultMessage="Underline"
                                                />
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={2.4}>
                                          <ColorPickerField
                                            label="Title Color"
                                            value={column.titleStyle?.color || theme.palette.text.primary}
                                            onChange={(value) => {
                                              const newColumns = [...(values.customConfig?.columns || [])];
                                              newColumns[index] = {
                                                ...column,
                                                titleStyle: {
                                                  ...column.titleStyle,
                                                  color: value
                                                }
                                              };
                                              setFieldValue('customConfig.columns', newColumns);
                                            }}
                                            defaultValue={theme.palette.text.primary}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Typography variant="caption" sx={{ fontWeight: 'medium', mb: 1, display: 'block' }}>
                                        <FormattedMessage
                                          id="footer.column.links"
                                          defaultMessage="Links"
                                        />
                                      </Typography>

                                      {column.links.map((link, linkIndex) => (
                                        <Box key={link.id} sx={{
                                          border: `1px solid ${theme.palette.divider}`,
                                          borderRadius: 1,
                                          p: 1.5,
                                          mb: 1,
                                          backgroundColor: theme.palette.background.default
                                        }}>
                                          <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={4}>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                label="Link Text"
                                                value={link.text}
                                                onChange={(e) => {
                                                  const newColumns = [...(values.customConfig?.columns || [])];
                                                  const newLinks = [...column.links];
                                                  newLinks[linkIndex] = { ...link, text: e.target.value };
                                                  newColumns[index] = { ...column, links: newLinks };
                                                  setFieldValue('customConfig.columns', newColumns);
                                                }}
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                label="URL"
                                                value={link.url}
                                                onChange={(e) => {
                                                  const newColumns = [...(values.customConfig?.columns || [])];
                                                  const newLinks = [...column.links];
                                                  newLinks[linkIndex] = { ...link, url: e.target.value };
                                                  newColumns[index] = { ...column, links: newLinks };
                                                  setFieldValue('customConfig.columns', newColumns);
                                                }}
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={2.4}>
                                              <ColorPickerField
                                                label="Link Color"
                                                value={link.style?.color || theme.palette.text.secondary}
                                                onChange={(value) => {
                                                  const newColumns = [...(values.customConfig?.columns || [])];
                                                  const newLinks = [...column.links];
                                                  newLinks[linkIndex] = {
                                                    ...link,
                                                    style: { ...link.style, color: value }
                                                  };
                                                  newColumns[index] = { ...column, links: newLinks };
                                                  setFieldValue('customConfig.columns', newColumns);
                                                }}
                                                defaultValue={theme.palette.text.secondary}
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={2.4}>
                                              <ColorPickerField
                                                label="Hover Color"
                                                value={link.style?.hoverColor || theme.palette.primary.main}
                                                onChange={(value) => {
                                                  const newColumns = [...(values.customConfig?.columns || [])];
                                                  const newLinks = [...column.links];
                                                  newLinks[linkIndex] = {
                                                    ...link,
                                                    style: { ...link.style, hoverColor: value }
                                                  };
                                                  newColumns[index] = { ...column, links: newLinks };
                                                  setFieldValue('customConfig.columns', newColumns);
                                                }}
                                                defaultValue={theme.palette.primary.main}
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={0.6}>
                                              <Button
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                  const newColumns = [...(values.customConfig?.columns || [])];
                                                  const newLinks = [...column.links];
                                                  newLinks.splice(linkIndex, 1);
                                                  newColumns[index] = { ...column, links: newLinks };
                                                  setFieldValue('customConfig.columns', newColumns);
                                                }}
                                              >
                                                ×
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        </Box>
                                      ))}

                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                          const newColumns = [...(values.customConfig?.columns || [])];
                                          const newLink = {
                                            id: `link-${Date.now()}`,
                                            text: 'New Link',
                                            url: '#',
                                            style: {
                                              fontSize: 14,
                                              color: theme.palette.text.secondary,
                                              hoverColor: theme.palette.primary.main,
                                              fontWeight: 'normal' as const,
                                              fontStyle: 'normal' as const,
                                            }
                                          };
                                          newColumns[index] = {
                                            ...column,
                                            links: [...column.links, newLink]
                                          };
                                          setFieldValue('customConfig.columns', newColumns);
                                        }}
                                        sx={{ mt: 1 }}
                                      >
                                        <FormattedMessage
                                          id="footer.add.link"
                                          defaultMessage="Add Link"
                                        />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>
                              ))}

                              <Button
                                variant="contained"
                                onClick={() => {
                                  const newColumn = {
                                    id: `column-${Date.now()}`,
                                    title: `Column ${(values.customConfig?.columns?.length || 0) + 1}`,
                                    titleStyle: {
                                      fontSize: 16,
                                      fontWeight: 'bold' as const,
                                      fontStyle: 'normal' as const,
                                      color: theme.palette.text.primary,
                                    },
                                    links: [],
                                    position: {
                                      x: (values.customConfig?.columns?.length || 0) * 25,
                                      y: 20,
                                      width: 20,
                                    }
                                  };
                                  const newColumns = [...(values.customConfig?.columns || []), newColumn];
                                  setFieldValue('customConfig.columns', newColumns);
                                }}
                                sx={{ mt: 2 }}
                              >
                                <FormattedMessage
                                  id="footer.add.column"
                                  defaultMessage="Add Column"
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'custom' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.logo"
                              defaultMessage="Logo Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                  <FormattedMessage
                                    id="footer.logo.upload"
                                    defaultMessage="Logo Image"
                                  />
                                </Typography>
                                <ButtonBase
                                  onClick={() => setShowLogoMediaDialog(true)}
                                  sx={{
                                    width: '100%',
                                    minHeight: 120,
                                    border: `2px dashed ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    p: 2,
                                    backgroundColor: values.customConfig?.logo?.url
                                      ? 'transparent'
                                      : theme.palette.action.hover,
                                    '&:hover': {
                                      backgroundColor: theme.palette.action.selected,
                                    },
                                  }}
                                >
                                  {values.customConfig?.logo?.url ? (
                                    <Box
                                      component="img"
                                      src={values.customConfig.logo.url}
                                      alt="Footer Logo"
                                      sx={{
                                        maxWidth: '100%',
                                        maxHeight: 80,
                                        objectFit: 'contain',
                                      }}
                                    />
                                  ) : (
                                    <>
                                      <ImageIcon sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
                                      <Typography variant="body2" color="text.secondary">
                                        <FormattedMessage
                                          id="footer.logo.select"
                                          defaultMessage="Click to select logo from gallery"
                                        />
                                      </Typography>
                                    </>
                                  )}
                                </ButtonBase>
                                {values.customConfig?.logo?.url && (
                                  <Button
                                    size="small"
                                    onClick={() => setFieldValue('customConfig.logo.url', '')}
                                    sx={{ mt: 1 }}
                                  >
                                    <FormattedMessage
                                      id="footer.logo.remove"
                                      defaultMessage="Remove Logo"
                                    />
                                  </Button>
                                )}
                              </Box>
                            </Grid>

                            {values.customConfig?.logo?.url && (
                              <>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.logo.width",
                                      defaultMessage: "Width (px)"
                                    })}
                                    value={values.customConfig?.logo?.width || 100}
                                    onChange={(e) => setFieldValue('customConfig.logo.width', parseInt(e.target.value) || 100)}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.logo.height",
                                      defaultMessage: "Height (px)"
                                    })}
                                    value={values.customConfig?.logo?.height || 50}
                                    onChange={(e) => setFieldValue('customConfig.logo.height', parseInt(e.target.value) || 50)}
                                  />
                                </Grid>

                                <Grid item xs={6} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.logo.x.position",
                                      defaultMessage: "X Position (%)"
                                    })}
                                    value={values.customConfig?.logo?.position?.x || 10}
                                    onChange={(e) => setFieldValue('customConfig.logo.position.x', parseInt(e.target.value) || 10)}
                                    inputProps={{ min: 0, max: 90 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.logo.y.position",
                                      defaultMessage: "Y Position (%)"
                                    })}
                                    value={values.customConfig?.logo?.position?.y || 10}
                                    onChange={(e) => setFieldValue('customConfig.logo.position.y', parseInt(e.target.value) || 10)}
                                    inputProps={{ min: 0, max: 90 }}
                                  />
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'custom' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.menu"
                              defaultMessage="Menu Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                <FormattedMessage
                                  id="footer.menu.configuration"
                                  defaultMessage="Configure menu appearance and positioning"
                                />
                              </Typography>
                            </Grid>

                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                <FormattedMessage
                                  id="footer.menu.position"
                                  defaultMessage="Position"
                                />
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="footer.menu.position.help"
                                  defaultMessage="Position your menu on the footer (X: 0-80%, Y: 0-70%)"
                                />
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.menu.x.position",
                                      defaultMessage: "X Position (%)"
                                    })}
                                    value={values.customConfig?.menu?.position?.x || 5}
                                    onChange={(e) => setFieldValue('customConfig.menu.position.x', parseInt(e.target.value) || 5)}
                                    inputProps={{ min: 0, max: 80 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.menu.y.position",
                                      defaultMessage: "Y Position (%)"
                                    })}
                                    value={values.customConfig?.menu?.position?.y || 40}
                                    onChange={(e) => setFieldValue('customConfig.menu.position.y', parseInt(e.target.value) || 40)}
                                    inputProps={{ min: 0, max: 85 }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                <FormattedMessage
                                  id="footer.menu.style"
                                  defaultMessage="Style"
                                />
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.menu.fontSize",
                                      defaultMessage: "Font Size (px)"
                                    })}
                                    value={values.customConfig?.menu?.style?.fontSize || 14}
                                    onChange={(e) => setFieldValue('customConfig.menu.style.fontSize', parseInt(e.target.value) || 14)}
                                    inputProps={{ min: 12, max: 20 }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl fullWidth>
                                    <InputLabel id="font-weight-label">
                                      <FormattedMessage
                                        id="footer.menu.fontWeight"
                                        defaultMessage="Font Weight"
                                      />
                                    </InputLabel>
                                    <Select
                                      labelId="font-weight-label"
                                      value={values.customConfig?.menu?.style?.fontWeight || 'normal'}
                                      onChange={(e) => setFieldValue('customConfig.menu.style.fontWeight', e.target.value)}
                                      label={formatMessage({
                                        id: "footer.menu.fontWeight",
                                        defaultMessage: "Font Weight"
                                      })}
                                    >
                                      <MenuItem value="normal">Normal</MenuItem>
                                      <MenuItem value="bold">Bold</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl fullWidth>
                                    <InputLabel id="font-style-label">
                                      <FormattedMessage
                                        id="footer.menu.fontStyle"
                                        defaultMessage="Font Style"
                                      />
                                    </InputLabel>
                                    <Select
                                      labelId="font-style-label"
                                      value={values.customConfig?.menu?.style?.fontStyle || 'normal'}
                                      onChange={(e) => setFieldValue('customConfig.menu.style.fontStyle', e.target.value)}
                                      label={formatMessage({
                                        id: "footer.menu.fontStyle",
                                        defaultMessage: "Font Style"
                                      })}
                                    >
                                      <MenuItem value="normal">Normal</MenuItem>
                                      <MenuItem value="italic">Italic</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl fullWidth>
                                    <InputLabel id="direction-label">
                                      <FormattedMessage
                                        id="footer.menu.direction"
                                        defaultMessage="Direction"
                                      />
                                    </InputLabel>
                                    <Select
                                      labelId="direction-label"
                                      value={values.customConfig?.menu?.style?.direction || 'vertical'}
                                      onChange={(e) => setFieldValue('customConfig.menu.style.direction', e.target.value)}
                                      label={formatMessage({
                                        id: "footer.menu.direction",
                                        defaultMessage: "Direction"
                                      })}
                                    >
                                      <MenuItem value="vertical">
                                        <FormattedMessage
                                          id="footer.menu.direction.vertical"
                                          defaultMessage="Vertical"
                                        />
                                      </MenuItem>
                                      <MenuItem value="horizontal">
                                        <FormattedMessage
                                          id="footer.menu.direction.horizontal"
                                          defaultMessage="Horizontal"
                                        />
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.menu.color",
                                      defaultMessage: "Text Color"
                                    })}
                                    value={values.customConfig?.menu?.style?.color || '#333333'}
                                    onChange={(value) => setFieldValue('customConfig.menu.style.color', value)}
                                    defaultValue="#333333"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.menu.hoverColor",
                                      defaultMessage: "Hover Color"
                                    })}
                                    value={values.customConfig?.menu?.style?.hoverColor || theme.palette.primary.main}
                                    onChange={(value) => setFieldValue('customConfig.menu.style.hoverColor', value)}
                                    defaultValue={theme.palette.primary.main}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.menu.spacing"
                                  defaultMessage="Spacing"
                                />
                              </Typography>
                              <Slider
                                value={values.customConfig?.menu?.style?.spacing || 2}
                                min={1}
                                max={4}
                                step={0.5}
                                marks
                                valueLabelDisplay="auto"
                                onChange={(_, value) => setFieldValue('customConfig.menu.style.spacing', value)}
                              />
                              <Typography variant="caption" color="text.secondary">
                                <FormattedMessage
                                  id="footer.menu.spacing.help"
                                  defaultMessage="Adjust spacing between menu items"
                                />
                              </Typography>
                            </Grid>


                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'custom' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.positioning"
                              defaultMessage="Positioning & Layout"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                <FormattedMessage
                                  id="footer.social.media.positioning"
                                  defaultMessage="Social Media"
                                />
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="footer.social.positioning.help"
                                  defaultMessage="Position limited to right area (X: 60-85%, Y: 10-80%) to maintain design integrity"
                                />
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.social.x.position",
                                      defaultMessage: "X Position (%)"
                                    })}
                                    value={values.customConfig?.socialMedia?.position?.x || 75}
                                    onChange={(e) => setFieldValue('customConfig.socialMedia.position.x', parseInt(e.target.value) || 75)}
                                    inputProps={{ min: 60, max: 85 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.social.y.position",
                                      defaultMessage: "Y Position (%)"
                                    })}
                                    value={values.customConfig?.socialMedia?.position?.y || 70}
                                    onChange={(e) => setFieldValue('customConfig.socialMedia.position.y', parseInt(e.target.value) || 70)}
                                    inputProps={{ min: 10, max: 80 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.social.icon.size",
                                      defaultMessage: "Icon Size (px)"
                                    })}
                                    value={values.customConfig?.socialMedia?.iconSize || 24}
                                    onChange={(e) => setFieldValue('customConfig.socialMedia.iconSize', parseInt(e.target.value) || 24)}
                                    inputProps={{ min: 16, max: 48 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.social.icon.color",
                                      defaultMessage: "Icon Color"
                                    })}
                                    value={values.customConfig?.socialMedia?.iconColor || '#333333'}
                                    onChange={(value) => setFieldValue('customConfig.socialMedia.iconColor', value)}
                                    defaultValue="#333333"
                                  />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.social.icon.hoverColor",
                                      defaultMessage: "Hover Color"
                                    })}
                                    value={values.customConfig?.socialMedia?.iconHoverColor || theme.palette.primary.main}
                                    onChange={(value) => setFieldValue('customConfig.socialMedia.iconHoverColor', value)}
                                    defaultValue={theme.palette.primary.main}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                <FormattedMessage
                                  id="footer.signature.positioning"
                                  defaultMessage="Signature"
                                />
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="footer.signature.positioning.help"
                                  defaultMessage="Position restricted to visible area (X: 0-60%, Y: 70-85%) to prevent hiding copyright notice"
                                />
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.signature.x.position",
                                      defaultMessage: "X Position (%)"
                                    })}
                                    value={values.customConfig?.signature?.position?.x || 10}
                                    onChange={(e) => setFieldValue('customConfig.signature.position.x', parseInt(e.target.value) || 10)}
                                    inputProps={{ min: 0, max: 60 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.signature.y.position",
                                      defaultMessage: "Y Position (%)"
                                    })}
                                    value={values.customConfig?.signature?.position?.y || 80}
                                    onChange={(e) => setFieldValue('customConfig.signature.position.y', parseInt(e.target.value) || 80)}
                                    inputProps={{ min: 70, max: 85 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label={formatMessage({
                                      id: "footer.signature.font.size",
                                      defaultMessage: "Font Size (px)"
                                    })}
                                    value={values.customConfig?.signature?.style?.fontSize || 14}
                                    onChange={(e) => setFieldValue('customConfig.signature.style.fontSize', parseInt(e.target.value) || 14)}
                                    inputProps={{ min: 10, max: 20 }}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                  <FormControl fullWidth>
                                    <InputLabel>Font Weight</InputLabel>
                                    <Select
                                      value={values.customConfig?.signature?.style?.fontWeight || 'normal'}
                                      onChange={(e) => setFieldValue('customConfig.signature.style.fontWeight', e.target.value)}
                                      label="Font Weight"
                                    >
                                      <MenuItem value="normal">Normal</MenuItem>
                                      <MenuItem value="bold">Bold</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                  <FormControl fullWidth>
                                    <InputLabel>Font Style</InputLabel>
                                    <Select
                                      value={values.customConfig?.signature?.style?.fontStyle || 'normal'}
                                      onChange={(e) => setFieldValue('customConfig.signature.style.fontStyle', e.target.value)}
                                      label="Font Style"
                                    >
                                      <MenuItem value="normal">Normal</MenuItem>
                                      <MenuItem value="italic">Italic</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                  <ColorPickerField
                                    label={formatMessage({
                                      id: "footer.signature.color",
                                      defaultMessage: "Text Color"
                                    })}
                                    value={values.customConfig?.signature?.style?.color || '#666666'}
                                    onChange={(value) => setFieldValue('customConfig.signature.style.color', value)}
                                    defaultValue="#666666"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'custom' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.preview"
                              defaultMessage="Layout Preview"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                <FormattedMessage
                                  id="footer.custom.preview.description"
                                  defaultMessage="Live preview of your custom footer layout"
                                />
                              </Typography>

                              <Box
                                sx={{
                                  position: 'relative',
                                  width: '100%',
                                  minHeight: '200px',
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: `${values.customConfig?.borderRadius || 0}px`,
                                  padding: theme.spacing(values.customConfig?.padding || 4),
                                  transition: 'all 0.3s ease-in-out',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 1,
                                    background: (() => {
                                      const config = values.customConfig;
                                      if (config?.backgroundType === 'gradient' && config.gradientColors && config.gradientColors.length >= 2) {
                                        return `linear-gradient(${config.gradientDirection || '45deg'}, ${config.gradientColors.join(', ')})`;
                                      } else if (config?.backgroundType === 'image' && config.backgroundImage) {
                                        return `url(${config.backgroundImage})`;
                                      }
                                      return config?.backgroundColor || '#ffffff';
                                    })(),
                                    backgroundSize: values.customConfig?.backgroundType === 'image' ? (values.customConfig?.backgroundSize || 'cover') : undefined,
                                    backgroundPosition: values.customConfig?.backgroundType === 'image' ? (values.customConfig?.backgroundPosition || 'center') : undefined,
                                    backgroundRepeat: values.customConfig?.backgroundType === 'image' ? (values.customConfig?.backgroundRepeat || 'no-repeat') : undefined,
                                    filter: values.customConfig?.backgroundBlur ? `blur(${values.customConfig.backgroundBlur}px)` : 'none',
                                  },
                                }}
                              >
                                {values.customConfig?.logo?.url && (() => {
                                  const paddingValue = values.customConfig?.padding || 4;
                                  const scale = 1 - (paddingValue * 0.05);
                                  const xPos = values.customConfig.logo.position?.x || 10;
                                  const yPos = values.customConfig.logo.position?.y || 10;
                                  const scaledX = 50 + (xPos - 50) * scale;
                                  const scaledY = 50 + (yPos - 50) * scale;

                                  return (
                                    <Box
                                      component="img"
                                      src={values.customConfig.logo.url}
                                      alt="Footer Logo"
                                      sx={{
                                        position: 'absolute',
                                        width: values.customConfig.logo.width ? `${values.customConfig.logo.width}px` : 'auto',
                                        height: values.customConfig.logo.height ? `${values.customConfig.logo.height}px` : 'auto',
                                        maxWidth: '200px',
                                        maxHeight: '100px',
                                        objectFit: 'contain',
                                        zIndex: 10,
                                        left: `${scaledX}%`,
                                        top: `${scaledY}%`,
                                        transform: 'none',
                                      }}
                                    />
                                  );
                                })()}

                                {values.customConfig?.columns?.map((column) => {
                                  const paddingValue = values.customConfig?.padding || 4;
                                  const scale = 1 - (paddingValue * 0.05);
                                  const xPos = column.position?.x || 0;
                                  const yPos = column.position?.y || 0;
                                  const scaledX = 50 + (xPos - 50) * scale;
                                  const scaledY = 50 + (yPos - 50) * scale;

                                  return (
                                    <Box
                                      key={column.id}
                                      sx={{
                                        position: 'absolute',
                                        left: `${scaledX}%`,
                                        top: `${scaledY}%`,
                                        width: column.position?.width ? `${column.position.width}%` : 'auto',
                                        minWidth: '150px',
                                        zIndex: 10,
                                      }}
                                    >
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          fontSize: `${column.titleStyle?.fontSize || 16}px`,
                                          fontWeight: column.titleStyle?.fontWeight === 'bold' ? 700 : 400,
                                          fontStyle: column.titleStyle?.fontStyle || 'normal',
                                          textDecoration: column.titleStyle?.textDecoration || 'none',
                                          color: column.titleStyle?.color || theme.palette.text.primary,
                                          marginBottom: theme.spacing(2),
                                          lineHeight: 1.3,
                                        }}
                                      >
                                        {column.title}
                                      </Typography>

                                      {column.links.map((link) => (
                                        <Typography
                                          key={link.id}
                                          variant="body2"
                                          component="div"
                                          sx={{
                                            display: 'block',
                                            fontSize: `${link.style?.fontSize || 14}px`,
                                            color: link.style?.color || theme.palette.text.secondary,
                                            fontWeight: link.style?.fontWeight === 'bold' ? 700 : 400,
                                            fontStyle: link.style?.fontStyle || 'normal',
                                            textDecoration: 'none',
                                            marginBottom: theme.spacing(1),
                                            cursor: 'pointer',
                                            lineHeight: 1.4,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                              color: link.style?.hoverColor || theme.palette.primary.main,
                                              textDecoration: 'underline',
                                            },
                                          }}
                                        >
                                          {link.text}
                                        </Typography>
                                      ))}
                                    </Box>
                                  );
                                })}

                                {config?.footerMenuTree && config.footerMenuTree.length > 0 && (() => {
                                  const paddingValue = values.customConfig?.padding || 4;
                                  const scale = 1 - (paddingValue * 0.05);
                                  const xPos = values.customConfig?.menu?.position?.x || 5;
                                  const yPos = values.customConfig?.menu?.position?.y || 40;
                                  const scaledX = 50 + (xPos - 50) * scale;
                                  const scaledY = 50 + (yPos - 50) * scale;
                                  const direction = values.customConfig?.menu?.style?.direction || 'vertical';
                                  const spacing = values.customConfig?.menu?.style?.spacing || 2;

                                  return (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        left: `${scaledX}%`,
                                        top: `${scaledY}%`,
                                        zIndex: 10,
                                        display: 'flex',
                                        flexDirection: direction === 'vertical' ? 'column' : 'row',
                                        gap: direction === 'vertical' ? `${spacing * 4}px` : `${spacing * 8}px`,
                                      }}
                                    >
                                      {config.footerMenuTree.map((menuItem: any, index: number) => (
                                        <Typography
                                          key={index}
                                          variant="body2"
                                          component="div"
                                          sx={{
                                            fontSize: `${values.customConfig?.menu?.style?.fontSize || 14}px`,
                                            color: values.customConfig?.menu?.style?.color || '#333333',
                                            fontWeight: values.customConfig?.menu?.style?.fontWeight === 'bold' ? 700 : 400,
                                            fontStyle: values.customConfig?.menu?.style?.fontStyle || 'normal',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            lineHeight: 1.4,
                                            transition: 'all 0.2s ease-in-out',
                                            whiteSpace: 'nowrap',
                                            '&:hover': {
                                              color: values.customConfig?.menu?.style?.hoverColor || theme.palette.primary.main,
                                              textDecoration: 'underline',
                                            },
                                          }}
                                        >
                                          {menuItem.name || menuItem.url}
                                        </Typography>
                                      ))}
                                    </Box>
                                  );
                                })()}

                                {(() => {
                                  const paddingValue = values.customConfig?.padding || 4;
                                  const scale = 1 - (paddingValue * 0.05);
                                  const xPos = values.customConfig?.socialMedia?.position?.x || 75;
                                  const yPos = values.customConfig?.socialMedia?.position?.y || 70;
                                  const scaledX = 50 + (xPos - 50) * scale;
                                  const scaledY = 50 + (yPos - 50) * scale;

                                  return (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        left: `${scaledX}%`,
                                        top: `${scaledY}%`,
                                        zIndex: 10,
                                        display: 'flex',
                                        gap: '8px',
                                      }}
                                    >
                                      {[1, 2, 3].map((index) => (
                                        <Box
                                          key={index}
                                          sx={{
                                            width: `${values.customConfig?.socialMedia?.iconSize || 24}px`,
                                            height: `${values.customConfig?.socialMedia?.iconSize || 24}px`,
                                            borderRadius: '50%',
                                            backgroundColor: values.customConfig?.socialMedia?.iconColor || '#333333',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                              backgroundColor: values.customConfig?.socialMedia?.iconHoverColor || theme.palette.primary.main,
                                              transform: 'scale(1.1)',
                                            },
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  );
                                })()}

                                {(() => {
                                  const paddingValue = values.customConfig?.padding || 4;
                                  const scale = 1 - (paddingValue * 0.05);
                                  const xPos = values.customConfig?.signature?.position?.x || 10;
                                  const yPos = values.customConfig?.signature?.position?.y || 80;
                                  const scaledX = 50 + (xPos - 50) * scale;
                                  const scaledY = 50 + (yPos - 50) * scale;

                                  return (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        left: `${scaledX}%`,
                                        top: `${scaledY}%`,
                                        zIndex: 10,
                                        fontSize: `${values.customConfig?.signature?.style?.fontSize || 14}px`,
                                        color: values.customConfig?.signature?.style?.color || '#666666',
                                        fontWeight: values.customConfig?.signature?.style?.fontWeight === 'bold' ? 700 : 400,
                                        fontStyle: values.customConfig?.signature?.style?.fontStyle || 'normal',
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {config.name} · made with ❤️ by{' '}
                                      <Link
                                        href="https://www.dexkit.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                          color: 'inherit',
                                          textDecoration: 'none',
                                          transition: 'color 0.2s ease-in-out',
                                          '&:hover': {
                                            color: values.customConfig?.socialMedia?.iconHoverColor || theme.palette.primary.main,
                                          }
                                        }}
                                      >
                                        DexKit
                                      </Link>
                                    </Box>
                                  );
                                })()}
                              </Box>

                              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                <FormattedMessage
                                  id="footer.preview.note"
                                  defaultMessage="This is a simplified preview. The actual footer will include your configured menu items and social media links."
                                />
                              </Typography>
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    const currentColumns = values.customConfig?.columns || [];

                                    const isDarkMode = theme.palette.mode === 'dark';
                                    const resetColors = {
                                      background: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
                                      textPrimary: theme.palette.text.primary,
                                      textSecondary: theme.palette.text.secondary,
                                      primary: theme.palette.primary.main,
                                    };

                                    const resetCustomConfig = {
                                      ...values.customConfig,
                                      backgroundColor: resetColors.background,
                                      backgroundType: 'solid',
                                      gradientDirection: '45deg',
                                      gradientColors: ['#ff6b6b', '#4ecdc4'],
                                      backgroundImage: '',
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundAttachment: 'scroll',
                                      backgroundBlur: 0,
                                      padding: 4,
                                      borderRadius: 0,
                                      logo: {
                                        url: '',
                                        width: 100,
                                        height: 50,
                                        position: { x: 10, y: 10 },
                                      },
                                      columns: currentColumns.map(column => ({
                                        ...column,
                                        position: {
                                          ...column.position,
                                          x: 1,
                                          y: 10,
                                        },
                                      })),
                                      menu: {
                                        position: { x: 40, y: 80 },
                                        style: {
                                          fontSize: 14,
                                          color: resetColors.textPrimary,
                                          hoverColor: resetColors.primary,
                                          fontWeight: 'normal',
                                          fontStyle: 'normal',
                                          spacing: 2,
                                          direction: 'horizontal',
                                        },
                                      },
                                      socialMedia: {
                                        position: { x: 75, y: 70 },
                                        iconSize: 24,
                                        iconColor: resetColors.textPrimary,
                                        iconHoverColor: resetColors.primary,
                                      },
                                      signature: {
                                        position: { x: 1, y: 80 },
                                        style: {
                                          fontSize: 14,
                                          color: resetColors.textSecondary,
                                          fontWeight: 'normal',
                                          fontStyle: 'normal',
                                        },
                                      },
                                    };
                                    setFieldValue('customConfig', resetCustomConfig);
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
                                    id="reset.visual.settings"
                                    defaultMessage="Reset Visual Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'glassmorphic' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.layout.positioning"
                              defaultMessage="Layout & Positioning"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.border.radius"
                                  defaultMessage="Border Radius"
                                />
                              </Typography>
                              <Slider
                                value={values.layout.borderRadius}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('layout.borderRadius', numericValue);
                                }}
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
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.signature.position"
                                    defaultMessage="Signature Position"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.layout.signaturePosition}
                                  onChange={(e) => setFieldValue('layout.signaturePosition', e.target.value)}
                                  label="Signature Position"
                                  error={!validateUniquePositions(
                                    values.layout.signaturePosition,
                                    values.layout.menuPosition,
                                    values.layout.socialMediaPosition
                                  )}
                                >
                                  {getAllPositions().map((option: { value: string; labelId: string; defaultMessage: string }) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <FormattedMessage
                                        id={option.labelId}
                                        defaultMessage={option.defaultMessage}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.menu.position"
                                    defaultMessage="Menu Position"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.layout.menuPosition}
                                  onChange={(e) => setFieldValue('layout.menuPosition', e.target.value)}
                                  label="Menu Position"
                                  error={!validateUniquePositions(
                                    values.layout.signaturePosition,
                                    values.layout.menuPosition,
                                    values.layout.socialMediaPosition
                                  )}
                                >
                                  {getAllPositions().map((option: { value: string; labelId: string; defaultMessage: string }) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <FormattedMessage
                                        id={option.labelId}
                                        defaultMessage={option.defaultMessage}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.social.media.position"
                                    defaultMessage="Social Media Position"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.layout.socialMediaPosition}
                                  onChange={(e) => setFieldValue('layout.socialMediaPosition', e.target.value)}
                                  label="Social Media Position"
                                  error={!validateUniquePositions(
                                    values.layout.signaturePosition,
                                    values.layout.menuPosition,
                                    values.layout.socialMediaPosition
                                  )}
                                >
                                  {getAllPositions().map((option: { value: string; labelId: string; defaultMessage: string }) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <FormattedMessage
                                        id={option.labelId}
                                        defaultMessage={option.defaultMessage}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            {!validateUniquePositions(
                              values.layout.signaturePosition,
                              values.layout.menuPosition,
                              values.layout.socialMediaPosition
                            ) && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                                    <FormattedMessage
                                      id="footer.positions.error"
                                      defaultMessage="Each position (left, center, right) can only be used once. Please select unique positions for signature, menu, and social media."
                                    />
                                  </Typography>
                                </Grid>
                              )}

                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                <FormattedMessage
                                  id="footer.layout.preview"
                                  defaultMessage="Layout Preview"
                                />
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  p: 2,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: `${values.layout.borderRadius}px`,
                                  backgroundColor: theme.palette.background.paper,
                                  minHeight: '60px',
                                }}
                              >
                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                  {values.layout.signaturePosition === 'left' && (
                                    <Typography variant="caption" color="primary">
                                      <FormattedMessage id="footer.signature" defaultMessage="Signature" />
                                    </Typography>
                                  )}
                                  {values.layout.menuPosition === 'left' && (
                                    <Typography variant="caption" color="secondary">
                                      <FormattedMessage id="footer.menu" defaultMessage="Footer menu" />
                                    </Typography>
                                  )}
                                  {values.layout.socialMediaPosition === 'left' && (
                                    <Typography variant="caption" color="info.main">
                                      <FormattedMessage id="footer.social.media" defaultMessage="Social Media" />
                                    </Typography>
                                  )}
                                </Box>

                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  {values.layout.signaturePosition === 'center' && (
                                    <Typography variant="caption" color="primary">
                                      <FormattedMessage id="footer.signature" defaultMessage="Signature" />
                                    </Typography>
                                  )}
                                  {values.layout.menuPosition === 'center' && (
                                    <Typography variant="caption" color="secondary">
                                      <FormattedMessage id="footer.menu" defaultMessage="Footer menu" />
                                    </Typography>
                                  )}
                                  {values.layout.socialMediaPosition === 'center' && (
                                    <Typography variant="caption" color="info.main">
                                      <FormattedMessage id="footer.social.media" defaultMessage="Social Media" />
                                    </Typography>
                                  )}
                                </Box>

                                <Box sx={{ flex: 1, textAlign: 'right' }}>
                                  {values.layout.signaturePosition === 'right' && (
                                    <Typography variant="caption" color="primary">
                                      <FormattedMessage id="footer.signature" defaultMessage="Signature" />
                                    </Typography>
                                  )}
                                  {values.layout.menuPosition === 'right' && (
                                    <Typography variant="caption" color="secondary">
                                      <FormattedMessage id="footer.menu" defaultMessage="Footer menu" />
                                    </Typography>
                                  )}
                                  {values.layout.socialMediaPosition === 'right' && (
                                    <Typography variant="caption" color="info.main">
                                      <FormattedMessage id="footer.social.media" defaultMessage="Social Media" />
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}



                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1} direction="row" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={submitForm}
                        disabled={
                          !hasChanged ||
                          (values.variant === 'glassmorphic' && !validateUniquePositions(
                            values.layout.signaturePosition,
                            values.layout.menuPosition,
                            values.layout.socialMediaPosition
                          ))
                        }
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          fontSize: isMobile ? '0.875rem' : undefined,
                          py: isMobile ? 0.75 : undefined,
                          px: isMobile ? 2 : undefined,
                        }}
                      >
                        <FormattedMessage id="save" defaultMessage="Save" />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Grid>

      <MediaDialog
        dialogProps={{
          open: showLogoMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => setShowLogoMediaDialog(false),
        }}
        onConfirmSelectFile={(file: { url: string }) => {
          if (currentSetFieldValue) {
            currentSetFieldValue('customConfig.logo.url', file.url);
          }
          setShowLogoMediaDialog(false);
        }}
      />
    </Grid>
  );
} 