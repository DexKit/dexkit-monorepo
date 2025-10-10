import React, { useCallback, useMemo } from "react";

import { FormattedMessage } from "react-intl";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { truncateAddress } from "@dexkit/core/utils";

import { arrayify } from "@dexkit/core/utils/ethers/arrayify";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AppDialogTitle } from "../AppDialogTitle";

interface ObjectToTreeProps {
  nodes: any;
}

export const ObjectToTree: React.FC<ObjectToTreeProps> = ({ nodes }) => {
  const renderTree = (node: any) => {
    if (node === null) {
      return <TreeItem nodeId={String(node)} label={"null"} />;
    } else if (
      ["string", "number", "array", "boolean", null].indexOf(typeof node) > -1
    ) {
      return (
        <TreeItem defaultChecked nodeId={String(node)} label={String(node)} />
      );
    }

    if (typeof node === "object") {
      const keys = Object.keys(node);

      return keys.map((key, index: number) => (
        <TreeItem
          defaultChecked
          key={`${key}-${index}`}
          label={String(key)}
          nodeId={`${key}-${index}`}
        >
          {renderTree(node[key])}
        </TreeItem>
      ));
    }
  };

  return (
    <TreeView
      multiSelect
      defaultCollapseIcon={<ArrowDropUpIcon />}
      defaultExpandIcon={<ArrowDropDownIcon />}
    >
      {renderTree(nodes)}
    </TreeView>
  );
};

interface Props {
  dialogProps: DialogProps;
  signData?: any;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const MagicSignDataDialog: React.FC<Props> = ({
  dialogProps,
  signData,
  onConfirm,
  onCancel,
}) => {
  const { onClose } = dialogProps;

  const { account } = useWeb3React();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, "escapeKeyDown");
    }
  }, [onClose]);

  const decodedText = useMemo(() => {
    if (signData?.params) {
      const ar = signData.params as string[];
      return new TextDecoder().decode(arrayify(ar[0]));
    }
  }, []);

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="sign.message" defaultMessage="Sign message" />
        }
        icon={<AssignmentTurnedInIcon />}
        onClose={handleClose}
      />

      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography gutterBottom align="center" variant="h5">
              <FormattedMessage
                id="sign.message"
                defaultMessage="Sign message"
              />
            </Typography>
            <Typography color="textSecondary" align="center">
              {account && truncateAddress(account)}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography align="center" gutterBottom variant="body1">
                  <FormattedMessage
                    id="message.you.are.signing"
                    defaultMessage="Message you are signing"
                  />
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="body1"
                  color="text.secondary"
                >
                  {decodedText}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onConfirm} variant="contained" color="primary">
          <FormattedMessage id="sign" defaultMessage="Sign" />
        </Button>
        <Button onClick={onCancel}>
          <FormattedMessage id="reject" defaultMessage="Reject" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MagicSignDataDialog;
