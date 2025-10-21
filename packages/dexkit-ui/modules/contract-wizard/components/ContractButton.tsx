import {
  Avatar,
  Box,
  ButtonBase,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import React from 'react';

export interface ContractButtonProps {
  title: React.ReactNode;
  description: React.ReactNode;
  creator: {
    imageUrl: string;
    name: string;
  };
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  targetBlank?: boolean;
  isDexKitContract?: boolean;
}

export default function ContractButton({
  creator,
  description,
  title,
  onClick,
  disabled,
  href,
  targetBlank,
  isDexKitContract = false,
}: ContractButtonProps) {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getDexKitLogo = (isDark: boolean = false) => {
    return isDark
      ? "https://dexkit.com/branding/Normal_logo/Normal_Isotype/white_Isotype_DexKit.png"
      : "https://dexkit.com/branding/Normal_logo/Normal_Isotype/black_Isotype_DexKit.png";
  };

  const CustomButton = React.useMemo(
    () =>
      // TODO: add typing here: https://mui.com/material-ui/guides/composition/
      (React as any).forwardRef(function ButtonB(ButtonBaseProps: any, ref: any) {
        if (href) {
          return (
            <ButtonBase
              ref={ref}
              href={href}
              target={targetBlank ? '_blank' : undefined}
              {...ButtonBaseProps}
            />
          );
        }
        return <ButtonBase ref={ref} {...ButtonBaseProps} />;
      }),
    [href, targetBlank],
  );

  return (
    <Paper
      component={CustomButton}
      onClick={onClick}
      href={href}
      targetBlank={targetBlank}
      disabled={disabled}
      sx={{
        p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
        width: '100%',
        height: { xs: theme.spacing(14), sm: theme.spacing(16) }, // Increased height for better logo visibility
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch', // Ensure full width usage
      }}
    >
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        width: '100%',
        alignItems: 'flex-start' // Force left alignment
      }}>
        <Typography
          gutterBottom
          variant="body1"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: { xs: theme.typography.body2.fontSize, sm: theme.typography.body1.fontSize },
            lineHeight: { xs: 1.2, sm: 1.5 },
            mb: theme.spacing(1),
            textAlign: 'left',
            width: '100%',
            alignSelf: 'flex-start'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize },
            lineHeight: { xs: 1.3, sm: 1.5 },
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            flex: 1,
            textAlign: 'left',
            width: '100%',
            alignSelf: 'flex-start'
          }}
        >
          {description}
        </Typography>
      </Box>

      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        mt: theme.spacing(1),
        flexShrink: 0
      }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={theme.spacing(0.5)}
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            textAlign: 'left'
          }}
        >
          <Avatar
            src={isDexKitContract ? getDexKitLogo(mode === 'dark') : (creator.imageUrl || getDexKitLogo(mode === 'dark'))}
            sx={{
              height: { xs: theme.spacing(1.5), sm: theme.spacing(1.75) },
              width: { xs: theme.spacing(1.5), sm: theme.spacing(1.75) },
              flexShrink: 0,
              '& .MuiAvatar-img': {
                objectFit: 'contain',
                padding: '0.125rem'
              }
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.caption.fontSize },
              textAlign: 'left',
              alignSelf: 'flex-start'
            }}
          >
            {creator.name}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
