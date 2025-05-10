import {
  Avatar,
  Box,
  ButtonBase,
  Paper,
  Stack,
  Typography,
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
        p: 2,
        width: '100%',
        textAlign: 'left',
        display: 'block',
      }}
    >
      <Box sx={{ minHeight: '6rem' }}>
        <Typography gutterBottom variant="body1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar src={creator.imageUrl} sx={{ height: '1rem', width: '1rem' }} />
        <Typography variant="caption">{creator.name}</Typography>
      </Stack>
    </Paper>
  );
}
