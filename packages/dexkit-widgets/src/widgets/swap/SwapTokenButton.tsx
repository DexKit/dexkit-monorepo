import {
  Avatar,
  ButtonBase,
  ButtonBaseProps,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { FormattedMessage } from "react-intl";
import { TOKEN_ICON_URL } from "../../constants";
import { ChainId } from "../../constants/enum";
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
        background: theme.palette.grey[400],
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
              token?.contractAddress
                ? TOKEN_ICON_URL(token?.contractAddress, ChainId.Ethereum)
                : undefined
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
