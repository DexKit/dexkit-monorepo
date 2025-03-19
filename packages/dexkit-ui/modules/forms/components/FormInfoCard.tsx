import { ChainId } from "@dexkit/core";
import {
  getBlockExplorerUrl,
  isAddressEqual,
  truncateAddress,
} from "@dexkit/core/utils";

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShareIcon from "@mui/icons-material/Share";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import NextLink from "next/link";
import { FormattedMessage } from "react-intl";

export interface FormInfoCardProps {
  onShare: () => void;
  onEdit: () => void;
  onClone: () => void;
  isLoading?: boolean;
  templateId?: number;
  name?: string;
  description?: string;
  creatorAddress?: string;
  contractAddress?: string;
  account?: string;
  chainId?: ChainId;
}

export default function FormInfoCard({
  isLoading,
  onShare,
  onEdit,
  onClone,
  name,
  description,
  creatorAddress,
  account,
  chainId,
  templateId,
  contractAddress,
}: FormInfoCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5">
              {isLoading ? <Skeleton /> : name}
            </Typography>
            <Typography color="text.secondary" variant="body1">
              {isLoading ? <Skeleton /> : description}
            </Typography>
          </Box>
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            alignContent="center"
          >
            <Avatar sx={{ width: "1rem", height: "1rem" }} />
            <Link
              component={NextLink}
              href={`/forms/account/${creatorAddress}`}
              variant="body2"
            >
              {isLoading ? <Skeleton /> : truncateAddress(creatorAddress)}
            </Link>
          </Stack>
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            alignContent="center"
          >
            <Button
              size="small"
              onClick={onShare}
              variant="contained"
              startIcon={<ShareIcon />}
            >
              <FormattedMessage id="share" defaultMessage="Share" />
            </Button>
            <Button
              size="small"
              onClick={onClone}
              variant="outlined"
              startIcon={<FileCopyIcon />}
            >
              <FormattedMessage id="clone" defaultMessage="Clone" />
            </Button>
            {isAddressEqual(creatorAddress, account) && (
              <Button
                onClick={onEdit}
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
              >
                <FormattedMessage id="edit" defaultMessage="Edit" />
              </Button>
            )}
            {templateId && (
              <Button
                size="small"
                href={`/forms/contract-templates/${templateId}`}
                variant="outlined"
                startIcon={<AccountTreeIcon />}
              >
                <FormattedMessage
                  id="view.template"
                  defaultMessage="View template"
                />
              </Button>
            )}
            <Button
              size="small"
              variant="outlined"
              startIcon={<ReceiptLongIcon />}
              target="_blank"
              href={`${getBlockExplorerUrl(
                chainId,
              )}/address/${contractAddress}`}
            >
              <FormattedMessage
                id="block.explorer"
                defaultMessage="Block explorer"
              />
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
