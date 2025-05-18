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
        p: { xs: 1.5, sm: 2 },
        width: '100%',
        textAlign: 'left',
        display: 'block',
      }}
    >
      <Box sx={{ minHeight: { xs: '5rem', sm: '6rem' } }}>
        <Typography
          gutterBottom
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: { xs: 1.2, sm: 1.5 },
            mb: 1
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
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

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
        <Avatar src={creator.imageUrl} sx={{ height: { xs: '0.9rem', sm: '1rem' }, width: { xs: '0.9rem', sm: '1rem' } }} />
        <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{creator.name}</Typography>
      </Stack>
    </Paper>
  );
}
