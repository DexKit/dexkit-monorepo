import LockIcon from '@mui/icons-material/Lock';
import { Avatar, ButtonBase, ButtonBaseProps, Stack, Typography, useTheme } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { isDexKitToken } from "../../constants/tokens";

export interface SwapTokenButtonProps {
  token?: Token;
  ButtonBaseProps?: ButtonBaseProps;
  locked?: boolean;
}

function SwapTokenButton({ token, ButtonBaseProps, locked }: SwapTokenButtonProps) {
  const theme = useTheme();

  const isKitToken = isDexKitToken(token);

  const content = token ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Avatar
        sx={(theme) => ({
          height: theme.spacing(4),
          width: theme.spacing(4),
          ...(isKitToken && theme.palette.mode === 'dark' && {
            filter: 'invert(1)',
          })
        })}
        imgProps={{ sx: { objectFit: "fill" } }}
        src={
          token.logoURI
            ? token.logoURI
            : TOKEN_ICON_URL(token.address, token.chainId)
        }
      />
      <Typography
        sx={{
          fontWeight: 600,
          color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary
        }}
        variant="body1"
      >
        {token?.symbol.toUpperCase()}
      </Typography>
      {locked && <LockIcon fontSize="small" sx={{ ml: 0.5, color: 'text.disabled' }} />}
    </Stack>
  ) : (
    <Typography
      sx={{
        color: (theme) => theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.primary
      }}
    >
      <FormattedMessage id="select.token" defaultMessage="Select token" />
    </Typography>
  );

  return (
    <Tooltip title={locked ? <FormattedMessage id="locked.token" defaultMessage="Locked token" /> : ""} arrow disableHoverListener={!locked} disableFocusListener={!locked}>
      <span>
        <ButtonBase
          {...ButtonBaseProps}
          sx={{
            borderRadius: (theme.shape.borderRadius as any) / 2,
            p: 1,
            border: `1px solid ${theme.palette.mode === "dark"
              ? theme.lighten(theme.palette.divider, 0.2)
              : theme.palette.divider
              }`,
            opacity: locked ? 0.5 : 1,
            pointerEvents: locked ? 'none' : undefined,
            cursor: locked ? 'not-allowed' : 'pointer',
            background: locked ? theme.palette.action.disabledBackground : undefined,
            ...(ButtonBaseProps?.sx || {}),
          }}
          tabIndex={locked ? -1 : ButtonBaseProps?.tabIndex}
          aria-disabled={locked}
        >
          {content}
        </ButtonBase>
      </span>
    </Tooltip>
  );
}

export default memo(SwapTokenButton);
