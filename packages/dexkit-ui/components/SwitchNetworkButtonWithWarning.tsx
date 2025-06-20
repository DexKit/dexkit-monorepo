import { getChainName } from "@dexkit/core/utils/blockchain";
import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useSwitchNetworkMutation } from "../hooks";

interface Props {
  desiredChainId?: number;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
}

export function SwitchNetworkButtonWithWarning({
  desiredChainId,
  size = "large",
  variant = "contained",
  fullWidth = false
}: Props) {
  const switchNetworkMutation = useSwitchNetworkMutation();

  return (
    <Stack spacing={2} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        <FormattedMessage
          id="switch.network.warning"
          defaultMessage="Please switch to {network} network to continue"
          values={{ network: getChainName(desiredChainId) }}
        />
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: fullWidth ? 'stretch' : 'center' }}>
        <Button
          disabled={switchNetworkMutation.isLoading}
          size={size}
          variant={variant}
          fullWidth={fullWidth}
          startIcon={
            switchNetworkMutation.isLoading ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : null
          }
          onClick={async () => {
            if (desiredChainId) {
              switchNetworkMutation.mutateAsync({ chainId: desiredChainId });
            }
          }}
          sx={{
            minWidth: fullWidth ? 'auto' : '200px',
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          <FormattedMessage
            id="switch.network"
            defaultMessage="Switch Network"
          />
        </Button>
      </Box>
    </Stack>
  );
} 