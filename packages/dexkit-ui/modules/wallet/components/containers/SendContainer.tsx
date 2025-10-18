import EvmTransferCoin from "@dexkit/ui/modules/evm-transfer-coin/components/EvmTransferCoin";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import QRCode from "qrcode.react";
import { useState } from "react";

import { FormattedMessage } from "react-intl";
import { PageHeader } from "../../../../components/PageHeader";
import { useEvmCoins } from "../../../../hooks/blockchain";
import { useParsePaymentRequest } from "../../hooks";

interface Props {
  paymentURL?: string;
}

function SendContainer({ paymentURL }: Props) {
  const theme = useTheme();
  const { account, chainId, provider } = useWeb3React();

  const [payment, setPayment] = useState(paymentURL);
  const paymentUrlParsed = useParsePaymentRequest({ paymentURL });
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const evmCoins = useEvmCoins({ defaultChainId: paymentUrlParsed?.chainId });

  const onChangePayment = (code?: string) => {
    setPayment(code);
  };

  return (
    <>
      <Box>
        <Container>
          <Grid container justifyContent="center" spacing={2}>
            <Grid size={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: "/",
                  },
                  {
                    caption: (
                      <FormattedMessage id="wallet" defaultMessage="Wallet" />
                    ),
                    uri: "/wallet",
                  },
                  {
                    caption: (
                      <FormattedMessage id="send" defaultMessage="Send" />
                    ),
                    uri: "/wallet/send",
                    active: true,
                  },
                ]}
              />
            </Grid>
            {paymentURL && payment && !isMobile && (
              <Grid size={12}>
                <Stack justifyContent={"center"} alignItems={"center"}>
                  <QRCode value={payment} />
                  <Typography variant="caption">
                    <FormattedMessage
                      id="scan.using.crypto.mobile.app"
                      defaultMessage="Scan QR code using crypto mobile app like Metamask or Trust"
                    />
                  </Typography>
                </Stack>
              </Grid>
            )}
            <Grid size={12}>
              <EvmTransferCoin
                account={account}
                defaultCoin={paymentUrlParsed?.defaultCoin}
                chainId={paymentUrlParsed?.chainId}
                amount={
                  paymentUrlParsed?.amount
                    ? Number(paymentUrlParsed?.amount)
                    : undefined
                }
                coins={evmCoins}
                to={paymentUrlParsed?.to}
                onChangePaymentUrl={onChangePayment}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default SendContainer;
