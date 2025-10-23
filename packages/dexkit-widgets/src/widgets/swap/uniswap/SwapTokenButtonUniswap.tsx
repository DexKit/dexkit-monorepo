import { Avatar, ButtonBase, ButtonBaseProps, Stack, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { isDexKitToken } from "../../../constants/tokens";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LockIcon from '@mui/icons-material/Lock';
import Tooltip from '@mui/material/Tooltip';

export interface SwapTokenButtonUniswapProps {
  token?: Token;
  ButtonBaseProps?: ButtonBaseProps;
  locked?: boolean;
}

function SwapTokenButtonUniswap({
  token,
  ButtonBaseProps,
  locked,
}: SwapTokenButtonUniswapProps) {
  const theme = useTheme();

  const isKitToken = isDexKitToken(token);

  const content = token ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Avatar
        sx={(theme) => ({
          height: theme.spacing(3),
          width: theme.spacing(3),
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
          color: 'text.secondary'
        }}
        variant="body1"
      >
        {token?.symbol.toUpperCase()}
      </Typography>
      <KeyboardArrowDownIcon fontSize="small" />
      {locked && <LockIcon fontSize="small" sx={{ ml: 0.5, color: 'text.disabled' }} />}
    </Stack>
  ) : (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography
        sx={{
          fontWeight: 600,
          color: 'text.primary'
        }}
        variant="body1"
      >
        <FormattedMessage id="select.token" defaultMessage="Select token" />
      </Typography>
      <KeyboardArrowDownIcon fontSize="small" />
    </Stack>
  );

  return (
    <Tooltip title={locked ? <FormattedMessage id="locked.token" defaultMessage="Locked token" /> : ""} arrow disableHoverListener={!locked} disableFocusListener={!locked}>
      <span>
        <ButtonBase
          {...ButtonBaseProps}
          sx={{
            borderRadius: (theme.shape.borderRadius as any) / 2,
            p: 1,
            backgroundColor: 'background.default',
            border: 1,
            borderColor: 'divider',
            opacity: locked ? 0.5 : 1,
            pointerEvents: locked ? 'none' : undefined,
            cursor: locked ? 'not-allowed' : 'pointer',
            ...(locked && {
              backgroundColor: 'action.disabledBackground',
            }),
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

export default memo(SwapTokenButtonUniswap);
