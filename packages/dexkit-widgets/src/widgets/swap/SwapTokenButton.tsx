import {
  Avatar,
  ButtonBase,
  ButtonBaseProps,
  lighten,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { FormattedMessage } from "react-intl";
import { TOKEN_ICON_URL } from "../../constants";
import { Token } from "../../types";

export interface SwapTokenButtonProps {
  token?: Token;
  ButtonBaseProps?: ButtonBaseProps;
}

function SwapTokenButton({ token, ButtonBaseProps }: SwapTokenButtonProps) {
  return (
    <ButtonBase
      {...ButtonBaseProps}
      sx={(theme) => ({
        borderRadius: theme.shape.borderRadius / 2,
        p: 1,
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? lighten(theme.palette.divider, 0.2)
            : theme.palette.divider
        }`,
      })}
    >
      {token ? (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Avatar
            sx={(theme) => ({
              height: theme.spacing(4),
              width: theme.spacing(4),
            })}
            src={
              token.logoURI
                ? token.logoURI
                : TOKEN_ICON_URL(token.contractAddress, token.chainId)
            }
          />

          <Typography
            sx={{ fontWeight: 600 }}
            color="text.secondary"
            variant="body1"
          >
            {token?.symbol.toUpperCase()}
          </Typography>
        </Stack>
      ) : (
        <Typography>
          <FormattedMessage id="select.token" defaultMessage="Select token" />
        </Typography>
      )}
    </ButtonBase>
  );
}

export default memo(SwapTokenButton);
