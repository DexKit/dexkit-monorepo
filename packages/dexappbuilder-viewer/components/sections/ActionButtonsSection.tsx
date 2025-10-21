import { Box, Container, Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";
import ActionButton from "./ActionButton";

interface Props {
  noInteract?: boolean;
}

export function ActionButtonsSection({ noInteract }: Props) {
  return (
    <Box py={4}>
      <Container>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ActionButton
              title={
                <FormattedMessage
                  id="connect.wallet"
                  defaultMessage="Connect wallet"
                />
              }
              subtitle={
                <FormattedMessage
                  id="connect.now"
                  defaultMessage="Connect now"
                />
              }
              backgroundImage={
                "https://raw.githubusercontent.com/DexKit/assets/main/connect-wallet-background.svg"
              }
              href={noInteract ? "javascript:void(0)" : "/wallet/connect"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ActionButton
              title={<FormattedMessage id="swap" defaultMessage="Swap" />}
              subtitle={<FormattedMessage id="open" defaultMessage="Open" />}
              href={noInteract ? "javascript:void(0)" : "/swap"}
              backgroundImage={
                "https://raw.githubusercontent.com/DexKit/assets/main/trade-button.svg"
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ActionButtonsSection;
