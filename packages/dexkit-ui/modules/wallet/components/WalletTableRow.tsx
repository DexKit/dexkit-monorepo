import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Box,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { FormattedNumber } from "react-intl";
import { TokenBalance } from "../types";

interface Props {
  isBalancesVisible: boolean;
  isLoadingCurrency?: boolean;
  tokenBalance: TokenBalance;
  currency: string;
  price?: number;
}

function WalletTableRow({
  tokenBalance,
  isBalancesVisible,
  isLoadingCurrency,
  price,
  currency,
}: Props) {
  const { chainId } = useWeb3React();
  const { token, balance } = tokenBalance;

  const balanceUnits = formatUnits(balance || "0", token.decimals);

  const totalInCurrency = (
    <FormattedNumber
      value={(price || 0) * Number(balanceUnits)}
      style={"currency"}
      currency={currency}
    />
  );
  return (
    <TableRow>
      <TableCell>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={2}
        >
          <Avatar
            sx={{ width: "auto", height: "2rem" }}
            src={
              token.logoURI
                ? ipfsUriToUrl(token.logoURI || "")
                : TOKEN_ICON_URL(token.address, chainId)
            }
          />

          <Box>
            <Typography variant="body1">{token.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {token.symbol}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        {isLoadingCurrency ? (
          <Skeleton>*****</Skeleton>
        ) : isBalancesVisible ? (
          totalInCurrency
        ) : (
          "*****"
        )}
      </TableCell>
      <TableCell>
        {isBalancesVisible ? (
          <>
            {<FormattedNumber value={Number(balanceUnits)} />} {token.symbol}
          </>
        ) : (
          "*****"
        )}
      </TableCell>
    </TableRow>
  );
}

export default WalletTableRow;
