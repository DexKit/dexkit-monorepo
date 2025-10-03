import { Avatar, ButtonBase, ButtonBaseProps, Stack, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { isDexKitToken } from "../../../constants/tokens";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface SwapTokenButtonMatchaProps {
  token?: Token;
  ButtonBaseProps?: ButtonBaseProps;
}

function SwapTokenButtonMatcha({
  token,
  ButtonBaseProps,
}: SwapTokenButtonMatchaProps) {
  const theme = useTheme();

  const isKitToken = isDexKitToken(token);

  return (
    <ButtonBase
      {...ButtonBaseProps}
      sx={(theme) => ({
        borderRadius: theme.shape.borderRadius,
        px: 0.5,
        py: 0.5,
        backgroundColor: token
          ? theme.palette.background.default
          : theme.palette.primary.main,
        border: `1px solid ${theme.palette.mode === "dark"
          ? theme.lighten(theme.palette.divider, 0.2)
          : theme.palette.divider
          }`,
      })}
    >
      {token ? (
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

          <Typography fontWeight="bold" variant="body1">
            {token?.symbol.toUpperCase()}
          </Typography>
          <ExpandMoreIcon />
        </Stack>
      ) : (
        <Stack
          sx={{ px: 0.5 }}
          direction="row"
          alignItems="center"
          spacing={0.5}
        >
          <Typography
            sx={(theme) => ({
              pb: 0.5,
              pt: 0.5,
              color: theme.palette.getContrastText(theme.palette.primary.main),
            })}
          >
            <FormattedMessage id="select.token" defaultMessage="Select token" />
          </Typography>
          <ExpandMoreIcon
            fontSize="small"
            sx={(theme) => ({
              color: theme.palette.getContrastText(theme.palette.primary.main),
            })}
          />
        </Stack>
      )}
    </ButtonBase>
  );
}

export default memo(SwapTokenButtonMatcha);
