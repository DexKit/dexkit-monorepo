import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";

import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import { useUserGaslessSettings } from "@dexkit/ui/modules/swap/hooks/useUserGaslessSettings";
import { ChangeEvent, memo, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface SwapSettingsGlassDialogProps {
  DialogProps: DialogProps;
  maxSlippage: number;
  title?: JSX.Element;
  useGasless?: boolean;
  isAutoSlippage: boolean;
  onAutoSlippage: (value: boolean) => void;
  onChangeSlippage: (value: number) => void;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

function SwapSettingsGlassDialog({
  DialogProps,
  maxSlippage,
  isAutoSlippage,
  useGasless,
  onAutoSlippage,
  onChangeSlippage,
  title,
  blurIntensity = 30,
  glassOpacity = 0.10,
  textColor,
}: SwapSettingsGlassDialogProps) {
  const theme = useTheme();
  const { onClose } = DialogProps;

  const [slippage, setSlippage] = useState<string>(
    (maxSlippage * 100).toString()
  );

  const [userGasless, setUserGasless] = useUserGaslessSettings();

  const finalTextColor = textColor || theme.palette.text.primary;

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  const handleToggleAutoSlippage = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    return onAutoSlippage(checked);
  };

  const handleToggleUserGasless = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    return setUserGasless(checked);
  };

  const handleChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
    setSlippage(e.target.value);
  };

  const handleSave = () => {
    if (isAutoSlippage) {
      onChangeSlippage(0);
      setSlippage("0.0");
    } else {
      onChangeSlippage(parseFloat(slippage) / 100);
    }
    handleClose();
  };

  const { formatMessage } = useIntl();

  const slippageError = useMemo(() => {
    if (parseFloat(slippage) > 100) {
      return formatMessage({
        id: "slippage.is.above.one.hundred.percent",
        defaultMessage: "Slippage is above 100%",
      });
    } else if (parseFloat(slippage) < 0) {
      return formatMessage({
        id: "slippage.is.below.zero",
        defaultMessage: "Slippage is below zero",
      });
    }
  }, [slippage]);

  return (
    <Dialog
      {...DialogProps}
      onClose={handleClose}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px) saturate(120%)',
          WebkitBackdropFilter: 'blur(8px) saturate(120%)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      }}
      PaperProps={{
        sx: {
          background: 'transparent',
          backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.1)`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.1)`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(6)} rgba(0, 0, 0, 0.15), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.2)}) inset`,
          borderRadius: theme.shape.borderRadius,
          minWidth: theme.spacing(40),
          maxWidth: theme.spacing(50),
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage id="swap.settings" defaultMessage="Swap Settings" />
        }
        onClose={handleClose}
        sx={{
          px: theme.spacing(3),
          py: theme.spacing(2),
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          borderBottom: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)})`,
          color: finalTextColor,
          '& .MuiTypography-root': {
            color: finalTextColor,
            fontWeight: theme.typography.fontWeightBold,
            textShadow: finalTextColor.includes('255, 255, 255')
              ? '0 1px 3px rgba(0, 0, 0, 0.4)'
              : '0 1px 3px rgba(255, 255, 255, 0.4)',
          },
          '& .MuiIconButton-root': {
            color: finalTextColor,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}
      />
      <DialogContent
        dividers={false}
        sx={{
          background: 'transparent',
          px: theme.spacing(3),
          py: theme.spacing(2.5),
        }}
      >
        <Stack spacing={theme.spacing(3)}>
          <FormControlLabel
            control={
              <Switch
                checked={isAutoSlippage}
                onChange={handleToggleAutoSlippage}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: finalTextColor,
                    '&.Mui-checked': {
                      color: finalTextColor,
                      '& + .MuiSwitch-track': {
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
                        backdropFilter: `blur(${blurIntensity * 0.3}px)`,
                        WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px)`,
                      },
                    },
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                    backdropFilter: `blur(${blurIntensity * 0.2}px)`,
                    WebkitBackdropFilter: `blur(${blurIntensity * 0.2}px)`,
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: finalTextColor,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.2)`,
                  },
                }}
              />
            }
            label={
              <FormattedMessage
                id="auto.slippage"
                defaultMessage="Auto Slippage"
              />
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                color: finalTextColor,
                fontWeight: theme.typography.fontWeightMedium,
                textShadow: finalTextColor.includes('255, 255, 255')
                  ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                  : '0 1px 2px rgba(255, 255, 255, 0.3)',
              },
            }}
          />

          {!isAutoSlippage && (
            <TextField
              value={slippage}
              onChange={handleChangeSlippage}
              type="number"
              fullWidth
              error={Boolean(slippageError)}
              helperText={slippageError}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                sx: {
                  background: `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                  backdropFilter: `blur(${blurIntensity * 0.5}px)`,
                  WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px)`,
                  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                  borderRadius: theme.shape.borderRadius,
                  color: finalTextColor,
                  '& input': {
                    color: finalTextColor,
                    '&::placeholder': {
                      color: `${finalTextColor}B3`,
                      opacity: 1,
                    },
                  },
                  '& .MuiInputAdornment-root': {
                    color: finalTextColor,
                  },
                  '&:hover': {
                    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.35)})`,
                    borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.4)})`,
                  },
                  '&.Mui-focused': {
                    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.35)})`,
                    borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                    boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.2)`,
                  },
                  '&.Mui-error': {
                    borderColor: theme.palette.error.main,
                    boxShadow: `0 0 0 2px ${theme.palette.error.main}20`,
                  },
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: Boolean(slippageError) ? theme.palette.error.main : finalTextColor,
                  opacity: 0.8,
                },
              }}
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={userGasless !== undefined ? userGasless : useGasless}
                onChange={handleToggleUserGasless}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: finalTextColor,
                    '&.Mui-checked': {
                      color: finalTextColor,
                      '& + .MuiSwitch-track': {
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
                        backdropFilter: `blur(${blurIntensity * 0.3}px)`,
                        WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px)`,
                      },
                    },
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                    backdropFilter: `blur(${blurIntensity * 0.2}px)`,
                    WebkitBackdropFilter: `blur(${blurIntensity * 0.2}px)`,
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: finalTextColor,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.2)`,
                  },
                }}
              />
            }
            label={
              <FormattedMessage
                id="gasless.swaps"
                defaultMessage="Gasless swaps"
              />
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                color: finalTextColor,
                fontWeight: theme.typography.fontWeightMedium,
                textShadow: finalTextColor.includes('255, 255, 255')
                  ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                  : '0 1px 2px rgba(255, 255, 255, 0.3)',
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          borderTop: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)})`,
          px: theme.spacing(3),
          py: theme.spacing(2),
          gap: theme.spacing(1.5),
        }}
      >
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
            backdropFilter: `blur(${blurIntensity * 0.5}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px)`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
            color: finalTextColor,
            fontWeight: theme.typography.fontWeightBold,
            px: theme.spacing(3),
            py: theme.spacing(1),
            boxShadow: `0 ${theme.spacing(0.5)} ${theme.spacing(2)} rgba(0, 0, 0, 0.2)`,
            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.7)})`,
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
              transform: 'scale(1.02)',
              boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(3)} rgba(0, 0, 0, 0.3)`,
            },
            transition: theme.transitions.create(['background-color', 'border-color', 'transform', 'box-shadow'], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <FormattedMessage id="save" defaultMessage="SAVE" />
        </Button>

        <Button
          onClick={handleClose}
          sx={{
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
            backdropFilter: `blur(${blurIntensity * 0.3}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px)`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
            color: finalTextColor,
            px: theme.spacing(3),
            py: theme.spacing(1),
            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
              transform: 'scale(1.02)',
            },
            transition: theme.transitions.create(['background-color', 'border-color', 'transform'], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <FormattedMessage id="cancel" defaultMessage="CANCEL" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(SwapSettingsGlassDialog); 