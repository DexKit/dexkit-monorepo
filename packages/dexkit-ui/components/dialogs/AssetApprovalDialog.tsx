import { TransactionStatus } from "@dexkit/core/constants/enums";
import { getBlockExplorerUrl } from "@dexkit/core/utils/blockchain";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

interface Props {
  hash?: string;
  status: TransactionStatus;
  dialogProps: DialogProps;
  title?: string | React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
}

export function AssetApprovalDialog({
  dialogProps,
  status,
  hash,
  icon,
  title,
}: Props) {
  const { onClose } = dialogProps;

  const { chainId } = useWeb3React();

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Box>
            <Typography variant="h5">
              <FormattedMessage
                defaultMessage="Approve Asset"
                id="approve.asset.title"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                defaultMessage="to App"
                id="approve.asset.description"
              />
            </Typography>
          </Box>
          {hash && (
            <Button
              href={`${getBlockExplorerUrl(chainId)}/tx/${hash}`}
              target="_blank"
            >
              View transaction
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default AssetApprovalDialog;
