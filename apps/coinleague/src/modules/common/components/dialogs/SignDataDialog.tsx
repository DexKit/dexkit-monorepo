import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useWeb3React } from '@web3-react/core';
import { truncateAddress } from '../../utils/blockchain';
import { AppDialogTitle } from '../AppDialogTitle';

interface ObjectToTreeProps {
  nodes: any;
}

export const ObjectToTree: React.FC<ObjectToTreeProps> = ({ nodes }) => {
  const renderTree = (node: any) => {
    if (node === null) {
      return <TreeItem nodeId={String(node)} label={'null'} />;
    } else if (
      ['string', 'number', 'array', 'boolean', null].indexOf(typeof node) > -1
    ) {
      return (
        <TreeItem defaultChecked nodeId={String(node)} label={String(node)} />
      );
    }

    if (typeof node === 'object') {
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

export const SignDataDialog: React.FC<Props> = ({
  dialogProps,
  signData,
  onConfirm,
  onCancel,
}) => {
  const { onClose } = dialogProps;

  const { account } = useWeb3React();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" gutterBottom variant="body1">
                  <FormattedMessage
                    id="message.you.are.signing"
                    defaultMessage="Message you are signing"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {signData && signData.params && signData.params.length > 0 && (
                  <Paper variant="outlined">
                    <ObjectToTree
                      nodes={JSON.parse(signData.params[1]).message}
                    />
                  </Paper>
                )}
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

export default SignDataDialog;
