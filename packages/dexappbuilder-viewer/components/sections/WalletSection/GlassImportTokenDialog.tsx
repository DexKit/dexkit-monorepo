import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormikHelpers, useFormik } from "formik";
import { useCallback, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";

import { useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { useDebounce } from "@dexkit/core/hooks/misc";
import { Network } from "@dexkit/core/types";
import { ipfsUriToUrl, isAddressEqual } from "@dexkit/core/utils";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { useDexKitContext } from "@dexkit/ui/hooks";
import { useActiveChainIds, useTokenData } from "@dexkit/ui/hooks/blockchain";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { AxiosError } from "axios";
import { useSnackbar } from "notistack";

interface Props {
  dialogProps: DialogProps;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

interface Form {
  chainId: number;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  chainId: Yup.number().required(),
  contractAddress: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),

  name: Yup.string().required(),
  symbol: Yup.string().required(),
  decimals: Yup.number().required(),
});

const GlassDialog = styled(Dialog)<{
  blurIntensity: number;
  glassOpacity: number;
}>(({ theme, blurIntensity, glassOpacity }) => ({
  '& .MuiDialog-paper': {
    background: `rgba(255, 255, 255, ${glassOpacity})`,
    backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
    WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.8)})`,
    borderRadius: theme.spacing(2.5),
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    position: 'relative',
    overflow: 'hidden',
    margin: theme.spacing(2),
    maxHeight: 'calc(100vh - 64px)',

    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(2),
      maxHeight: 'calc(100vh - 32px)',
      width: 'calc(100vw - 32px)',
      maxWidth: 'calc(100vw - 32px)',
    },

    [theme.breakpoints.down(400)]: {
      margin: 0,
      borderRadius: 0,
      maxHeight: '100vh',
      height: '100vh',
      width: '100vw',
      maxWidth: '100vw',
    },

    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(2),
      borderRadius: theme.spacing(2.5),
      maxWidth: '480px',
      minWidth: '420px',
    },

    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(3),
      borderRadius: theme.spacing(3),
      maxWidth: '520px',
      minWidth: '480px',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    },

    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },

  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px) brightness(0.7)',
    WebkitBackdropFilter: 'blur(8px) brightness(0.7)',
    background: 'rgba(0, 0, 0, 0.5)',

    [theme.breakpoints.down(400)]: {
      background: 'rgba(0, 0, 0, 0.7)',
    },
  },

  '& .MuiDivider-root': {
    borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
  },
}));

interface GlassButtonProps {
  glassOpacity: number;
  textColor: string;
  glassVariant?: 'primary' | 'secondary';
}

const GlassButton = styled(Button, {
  shouldForwardProp: (prop) => !['glassOpacity', 'textColor', 'glassVariant'].includes(prop as string),
}) <GlassButtonProps>`
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(1, 2)};
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(0.8, 1.6)};
    font-size: 0.85rem;
    border-radius: ${({ theme }) => theme.spacing(1.2)};
  }

  ${({ theme }) => theme.breakpoints.down(400)} {
    padding: ${({ theme }) => theme.spacing(0.7, 1.2)};
    font-size: 0.8rem;
    border-radius: ${({ theme }) => theme.spacing(1)};
    min-width: 80px;
    flex: 1 1 auto;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding: ${({ theme }) => theme.spacing(1.2, 2.5)};
    font-size: 1rem;
    border-radius: ${({ theme }) => theme.spacing(1.8)};
  }

  ${({ glassVariant, glassOpacity, textColor, theme }) => glassVariant === 'primary' ? `
    background: rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.6)});
    backdrop-filter: blur(${theme.spacing(5)}px) saturate(180%) brightness(120%);
    -webkit-backdrop-filter: blur(${theme.spacing(5)}px) saturate(180%) brightness(120%);
    border: 1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)});
    color: ${textColor};
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)}),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    text-shadow: ${textColor.includes('255, 255, 255')
      ? '0 1px 2px rgba(0, 0, 0, 0.3)'
      : '0 1px 2px rgba(255, 255, 255, 0.3)'};

    &:hover {
      background: rgba(255, 255, 255, ${Math.min(glassOpacity + 0.25, 0.75)});
      backdrop-filter: blur(${theme.spacing(6)}px) saturate(200%) brightness(130%);
      -webkit-backdrop-filter: blur(${theme.spacing(6)}px) saturate(200%) brightness(130%);
      box-shadow: 
        0 12px 35px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)}),
        inset 0 -1px 0 rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.9)});
    }

    &.Mui-disabled {
      background: rgba(255, 255, 255, ${glassOpacity * 0.6});
      color: ${textColor}50;
      opacity: 0.6;
      transform: none;
      backdrop-filter: blur(${theme.spacing(2)}px);
      -webkit-backdrop-filter: blur(${theme.spacing(2)}px);
    }
  ` : `
    background: rgba(255, 255, 255, ${glassOpacity});
    color: ${textColor};
    border: 1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.8)});
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)});
      box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  `}
`;

const GlassDialogActions = styled(DialogActions)<{
  glassOpacity: number;
}>(({ theme, glassOpacity }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.3})`,
  gap: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(0.8),
    flexDirection: 'row',
  },

  [theme.breakpoints.down(400)]: {
    padding: theme.spacing(1),
    gap: theme.spacing(0.6),
    flexDirection: 'row',
  },

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2.5),
    gap: theme.spacing(1.2),
  },
}));

function GlassImportTokenDialog({
  dialogProps,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff'
}: Props) {
  const { activeChainIds } = useActiveChainIds();
  const { onClose } = dialogProps;
  const { chainId } = useWeb3React();
  const { tokens, setTokens } = useDexKitContext();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    (values: Form, formikHelpers: FormikHelpers<Form>) => {
      const token = tokens.find(
        (t: any) =>
          t.chainId === values.chainId &&
          isAddressEqual(values.contractAddress, t.address)
      );

      if (!token) {
        setTokens((value: any) => [
          ...value,
          {
            address: values.contractAddress.toLocaleLowerCase(),
            chainId: values.chainId,
            decimals: values.decimals,
            logoURI: "",
            name: values.name,
            symbol: values.symbol,
          },
        ]);

        enqueueSnackbar(
          formatMessage({
            defaultMessage: "Token added",
            id: "token.added",
          }),
          {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
      }

      formikHelpers.resetForm();

      if (onClose) {
        onClose({}, "escapeKeyDown");
      }
    },
    [tokens, enqueueSnackbar, onClose]
  );

  const formik = useFormik<Form>({
    initialValues: {
      chainId: 1,
      contractAddress: "",
      name: "",
      decimals: 0,
      symbol: "",
    },
    validationSchema: FormSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (chainId !== undefined) {
      formik.setFormikState((value) => ({
        ...value,
        values: { ...value.values, chainId },
      }));
    }
  }, [chainId]);

  const lazyAddress = useDebounce<string>(formik.values.contractAddress, 500);

  const tokenData = useTokenData({
    onSuccess: ({
      decimals,
      name,
      symbol,
    }: {
      decimals: number;
      name: string;
      symbol: string;
    }) => {
      formik.setValues((value: any) => ({ ...value, name, decimals, symbol }), true);
    },
    onError: (err: AxiosError) => {
      formik.resetForm();
    },
  });

  const handleSubmitForm = () => {
    formik.submitForm();
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    formik.resetForm();
  };

  const handleCloseError = () => tokenData.reset();

  useEffect(() => {
    if (lazyAddress !== "") {
      const token = tokens.find(
        (t: any) =>
          t.chainId === formik.values.chainId &&
          isAddressEqual(lazyAddress, t.address)
      );

      if (token) {
        formik.setFieldError(
          "contractAddress",
          formatMessage({
            id: "token.already.imported",
            defaultMessage: "Token already imported",
          })
        );
      } else {
        tokenData.mutate({
          chainId: formik.values.chainId,
          address: lazyAddress,
        });
      }
    }
  }, [lazyAddress, formik.values.chainId]);

  return (
    <GlassDialog
      {...dialogProps}
      fullScreen={isMobile}
      blurIntensity={blurIntensity}
      glassOpacity={glassOpacity}
    >
      <AppDialogTitle
        title={
          <FormattedMessage
            id="import.token"
            defaultMessage="Import Token"
            description="Import token dialog title"
          />
        }
        onClose={handleClose}
        sx={{
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(1.5) : theme.spacing(2),
          background: 'transparent',
          color: textColor,
          fontWeight: 600,


          '& .MuiTypography-root': {
            fontSize: '1.25rem',
          },

          [theme.breakpoints.down('sm')]: {
            px: theme.spacing(1.5),
            py: theme.spacing(1.2),
            '& .MuiTypography-root': {
              fontSize: '1.1rem',
            },
          },

          [theme.breakpoints.down(400)]: {
            px: theme.spacing(1),
            py: theme.spacing(1),
            '& .MuiTypography-root': {
              fontSize: '1rem',
            },
          },

          [theme.breakpoints.up('lg')]: {
            px: theme.spacing(3.5),
            py: theme.spacing(2.5),
            '& .MuiTypography-root': {
              fontSize: '1.4rem',
            },
          },

          '& .MuiIconButton-root': {
            color: `${textColor} !important`,
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8}) !important`,
            backdropFilter: `blur(${blurIntensity * 0.5}px) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px) !important`,
            border: '1px solid rgba(255, 255, 255, 0.2) !important',
            transition: 'all 0.2s ease-in-out !important',
            borderRadius: '50% !important',
            width: '32px !important',
            height: '32px !important',

            '&:hover': {
              background: `rgba(255, 255, 255, ${glassOpacity * 1.2}) !important`,
              transform: 'scale(1.05) !important',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2) !important',
              backdropFilter: `blur(${blurIntensity * 0.7}px) !important`,
              WebkitBackdropFilter: `blur(${blurIntensity * 0.7}px) !important`,
            },

            '&:active': {
              transform: 'scale(0.98) !important',
            },

            [theme.breakpoints.down('sm')]: {
              width: '32px !important',
              height: '32px !important',
            },

            [theme.breakpoints.down(400)]: {
              width: '32px !important',
              height: '32px !important',
            },
          },
        }}
      />
      <Divider />
      <DialogContent
        sx={{
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(2) : theme.spacing(3),
          background: 'transparent',

          [theme.breakpoints.down('sm')]: {
            px: theme.spacing(1.5),
            py: theme.spacing(1.5),
          },

          [theme.breakpoints.down(400)]: {
            px: theme.spacing(1),
            py: theme.spacing(1),
          },

          [theme.breakpoints.up('lg')]: {
            px: theme.spacing(3.5),
            py: theme.spacing(3.5),
          },

          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
              backdropFilter: `blur(${blurIntensity * 0.6}px)`,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)})`,
              borderRadius: theme.spacing(1.5),
              color: textColor,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

              '& fieldset': {
                border: 'none',
              },

              '&:hover': {
                background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)})`,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },

              '&.Mui-focused': {
                background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.6)})`,
                boxShadow: `0 0 0 2px ${textColor}40`,
                transform: 'translateY(-1px)',
              },

              '&.Mui-disabled': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.4})`,
                opacity: 0.7,
                transform: 'none',
              },

              '& input': {
                color: textColor,
                fontSize: '0.95rem',

                '&::placeholder': {
                  color: `${textColor}CC`,
                },
                '&:disabled': {
                  color: `${textColor}AA`,
                  WebkitTextFillColor: `${textColor}AA`,
                },

                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.9rem',
                },

                [theme.breakpoints.down(400)]: {
                  fontSize: '0.85rem',
                },
              },
            },

            '& .MuiInputLabel-root': {
              color: textColor,
              fontWeight: 500,
              fontSize: '0.9rem',

              '&.Mui-focused': {
                color: textColor,
              },
              '&.MuiInputLabel-shrunk': {
                color: textColor,
              },
              '&.Mui-disabled': {
                color: `${textColor}AA`,
              },

              [theme.breakpoints.down('sm')]: {
                fontSize: '0.85rem',
              },
            },

            '& .MuiFormHelperText-root': {
              color: '#ff6b6b',
              fontWeight: 500,
              background: `rgba(255, 107, 107, 0.15)`,
              backdropFilter: `blur(${blurIntensity * 0.3}px)`,
              padding: '6px 10px',
              borderRadius: theme.spacing(1),
              margin: '6px 0 0 0',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              fontSize: '0.8rem',

              [theme.breakpoints.down('sm')]: {
                fontSize: '0.75rem',
                padding: '4px 8px',
              },
            },
          },

          '& .MuiFormControl-root .MuiSelect-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8}) !important`,
            backdropFilter: `blur(${blurIntensity * 0.6}px) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.6}px) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)}) !important`,
            borderRadius: `${theme.spacing(1.5)} !important`,
            color: `${textColor} !important`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
            boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})
              `,

            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none !important',
            },

            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)}) !important`,
              transform: 'translateY(-1px)',
              boxShadow: `
                  0 6px 20px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.5)})
                `,

              [theme.breakpoints.down('sm')]: {
                transform: 'translateY(-0.5px)',
              },
            },

            '&.Mui-focused': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.6)}) !important`,
              boxShadow: `
                  0 0 0 2px ${textColor}40,
                  0 6px 20px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})
                `,
              transform: 'translateY(-1px)',

              [theme.breakpoints.down('sm')]: {
                transform: 'translateY(-0.5px)',
              },
            },

            '& .MuiSelect-select': {
              color: `${textColor} !important`,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1),
              fontSize: '0.95rem',
              fontWeight: 500,

              [theme.breakpoints.down('sm')]: {
                fontSize: '0.9rem',
              },

              [theme.breakpoints.down(400)]: {
                fontSize: '0.85rem',
                gap: theme.spacing(0.8),
              },
            },

            '& .MuiSelect-icon': {
              color: `${textColor} !important`,
              opacity: '0.7 !important',
              transition: 'all 0.2s ease-in-out',

              '&.MuiSelect-iconOpen': {
                opacity: '1 !important',
                transform: 'rotate(180deg)',
              },
            },
          },

          '& .MuiFormControl-root .MuiOutlinedInput-root': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.8}) !important`,
            backdropFilter: `blur(${blurIntensity * 0.6}px) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.6}px) !important`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)}) !important`,
            borderRadius: `${theme.spacing(1.5)} !important`,

            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none !important',
            },

            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)}) !important`,
            },

            '&.Mui-focused': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.6)}) !important`,
              boxShadow: `0 0 0 2px ${textColor}40 !important`,
            },
          },

          '& .MuiPaper-root.MuiMenu-paper': {
            background: `rgba(255, 255, 255, ${glassOpacity * 0.95})`,
            backdropFilter: `blur(${blurIntensity}px) saturate(180%)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%)`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)})`,
            borderRadius: theme.spacing(1.5),
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            marginTop: theme.spacing(0.5),

            '& .MuiMenuItem-root': {
              color: textColor,
              borderRadius: theme.spacing(1),
              margin: '3px 6px',
              transition: 'all 0.2s ease-in-out',
              fontSize: '0.9rem',

              '&:hover': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.6})`,
                transform: 'translateX(4px)',
              },

              '&.Mui-selected': {
                background: `rgba(255, 255, 255, ${glassOpacity * 0.8})`,
                '&:hover': {
                  background: `rgba(255, 255, 255, ${glassOpacity * 0.9})`,
                },
              },

              '& .MuiListItemText-primary': {
                color: textColor,
                fontWeight: 500,
              },

              [theme.breakpoints.down('sm')]: {
                fontSize: '0.85rem',
                margin: '2px 4px',
              },
            },
          },

          '& .MuiAvatar-root': {
            border: `2px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)})`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease-in-out',

            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
            },
          },

          '& .MuiTypography-root': {
            color: textColor,
          },

          '& .MuiAlert-root': {
            background: `rgba(255, 107, 107, ${glassOpacity * 0.9})`,
            backdropFilter: `blur(${blurIntensity * 0.7}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.7}px)`,
            border: '1px solid rgba(255, 107, 107, 0.4)',
            borderRadius: theme.spacing(1.5),
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',

            '& .MuiAlert-icon': {
              color: '#ffffff',
            },

            '& .MuiIconButton-root': {
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: theme.spacing(0.8),

              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.05)',
              },
            },

            [theme.breakpoints.down('sm')]: {
              fontSize: '0.85rem',
            },
          },

          '& .MuiListItemIcon-root': {
            minWidth: 'auto',
            marginRight: theme.spacing(1),

            [theme.breakpoints.down('sm')]: {
              marginRight: theme.spacing(0.8),
            },
          },
        }}
      >
        <Stack spacing={2}>
          {tokenData.isError && (
            <Alert severity="error" onClose={handleCloseError}>
              {String(tokenData.error)}
            </Alert>
          )}
          <FormControl>
            <Select
              fullWidth
              value={formik.values.chainId}
              onChange={formik.handleChange}
              name="chainId"
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
                        NETWORKS[formik.values.chainId].imageUrl || ""
                      )}
                      style={{ width: "auto", height: "1rem" }}
                    />
                    <Typography variant="body1">
                      {NETWORKS[formik.values.chainId].name}
                    </Typography>
                  </Stack>
                );
              }}
            >
              {Object.keys(NETWORKS)
                .filter((k) => activeChainIds.includes(Number(k)))
                .filter((key) => !NETWORKS[Number(key)].testnet)
                .map((key: any, index: number) => (
                  <MenuItem key={index} value={key}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: (theme) => theme.spacing(4),
                          display: "flex",
                          alignItems: "center",
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Avatar
                          src={ipfsUriToUrl(
                            (NETWORKS[key] as Network)?.imageUrl || ""
                          )}
                          sx={{
                            width: "auto",
                            height: "1rem",
                          }}
                        />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={NETWORKS[key].name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            value={formik.values.contractAddress}
            onChange={formik.handleChange}
            name="contractAddress"
            label={formatMessage({
              id: "contract.address",
              defaultMessage: "Contract Address",
            })}
            error={Boolean(formik.errors.contractAddress)}
            helperText={
              Boolean(formik.errors.contractAddress)
                ? formik.errors.contractAddress
                : undefined
            }
          />
          <TextField
            fullWidth
            disabled={true}
            value={formik.values.name}
            onChange={formik.handleChange}
            name="name"
            label={formatMessage({
              id: "name",
              defaultMessage: "Name",
            })}
          />
          <TextField
            fullWidth
            disabled={true}
            value={formik.values.symbol}
            onChange={formik.handleChange}
            name="symbol"
            label={formatMessage({
              id: "symbol",
              defaultMessage: "Symbol",
            })}
          />
          <TextField
            disabled={true}
            type="number"
            fullWidth
            value={formik.values.decimals}
            onChange={formik.handleChange}
            name="decimals"
            label={formatMessage({
              id: "decimals",
              defaultMessage: "Decimals",
            })}
          />
        </Stack>
      </DialogContent>
      <GlassDialogActions glassOpacity={glassOpacity}>
        <GlassButton onClick={handleClose} glassOpacity={glassOpacity} textColor={textColor}>
          <FormattedMessage
            id="cancel"
            defaultMessage="CANCEL"
            description="Cancel"
          />
        </GlassButton>
        <GlassButton
          disabled={!formik.isValid || tokenData.isLoading}
          onClick={handleSubmitForm}
          glassOpacity={glassOpacity}
          textColor={textColor}
          glassVariant="primary"
        >
          <FormattedMessage
            id="import"
            defaultMessage="IMPORT"
            description="Import"
          />
        </GlassButton>
      </GlassDialogActions>
    </GlassDialog>
  );
}

export default GlassImportTokenDialog; 