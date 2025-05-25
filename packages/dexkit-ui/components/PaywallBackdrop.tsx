import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { Backdrop, Box, Button, Stack, Typography } from "@mui/material";
import Decimal from "decimal.js";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSubscription } from "../hooks/payments";
import AddCreditDialog from "./dialogs/AddCreditDialog";

export default function PaywallBackdrop() {
  const [open, setOpen] = useState(true);

  const { data: sub, refetch: refetchSub } = useSubscription();


  const total = useMemo(() => {
    if (sub ) {
      return  (new Decimal(sub?.creditsAvailable).minus(
            new Decimal(sub?.creditsUsed))
        )
        .toNumber();
    }

    return 0;
  }, [ sub]);

  const [showAddCredits, setShowAddCredits] = useState(false);
  const handleAddCredits = async () => {
    setShowAddCredits(true);
  };

  const handleClose = () => {
    setShowAddCredits(false);
    refetchSub();
  };

  const handleCloseBackdrop = () => {
    setOpen(false);
  };

  return (
    <>
      <AddCreditDialog
        DialogProps={{
          open: showAddCredits,
          onClose: handleClose,
          maxWidth: "sm",
          fullWidth: true,
        }}
      />
      <Backdrop
        sx={(theme) => ({
          zIndex: theme.zIndex.drawer + 1,
          position: "absolute",
          backdropFilter: "blur(10px)",
        })}
        open={total === 0 && open}
      >
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <AutoAwesome fontSize="large" />
          <Box>
            <Typography align="center" variant="h5" fontWeight="bold">
              <FormattedMessage id="no.credits" defaultMessage="No Credits" />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="you.need.to.add.credits.to.use.ai.features"
                defaultMessage="You need to add credits to use AI features"
              />
            </Typography>
          </Box>
          <Stack spacing={1} direction="row">
            <Button
              onClick={handleCloseBackdrop}
              variant="outlined"
              size="small"
            >
              <FormattedMessage id="close" defaultMessage="Close" />
            </Button>
            <Button onClick={handleAddCredits} variant="contained" size="small">
              <FormattedMessage id="add.credits" defaultMessage="Add credits" />
            </Button>
          </Stack>
        </Stack>
      </Backdrop>
    </>
  );
}
