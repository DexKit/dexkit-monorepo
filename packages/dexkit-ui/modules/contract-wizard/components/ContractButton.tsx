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
}

export default function ContractButton({
  creator,
  description,
  title,
  onClick,
  disabled,
  href,
  targetBlank,
}: ContractButtonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const CustomButton = React.useMemo(
    () =>
      // TODO: add typing here: https://mui.com/material-ui/guides/composition/
      React.forwardRef<any, any>(function ButtonB(ButtonBaseProps, ref) {
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
        textAlign: 'left',
        display: 'block',
      }}
    >
      <Box sx={{ minHeight: { xs: theme.spacing(6.25), sm: theme.spacing(7.5) } }}>
        <Typography
          gutterBottom
          variant="body1"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: { xs: theme.typography.body2.fontSize, sm: theme.typography.body1.fontSize },
            lineHeight: { xs: 1.2, sm: 1.5 },
            mb: theme.spacing(1)
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
            WebkitLineClamp: 3
          }}
        >
          {description}
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={theme.spacing(0.5)} sx={{ mt: theme.spacing(1) }}>
        <Avatar src={creator.imageUrl} sx={{ height: { xs: theme.spacing(1.125), sm: theme.spacing(1.25) }, width: { xs: theme.spacing(1.125), sm: theme.spacing(1.25) } }} />
        <Typography variant="caption" sx={{ fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.caption.fontSize } }}>{creator.name}</Typography>
      </Stack>
    </Paper>
  );
}
