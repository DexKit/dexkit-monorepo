import { Button, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import ShareDialogV2 from "@dexkit/ui/components/dialogs/ShareDialogV2";
import NextLink from "next/link";
import { useState } from "react";
import CheckoutsTable from "../CheckoutsTable";
import DashboardLayout from "../layouts/DashboardLayout";
import useParams from "./hooks/useParams";

export default function CheckoutsContainer() {
  const [url, setUrl] = useState<string>();

  const handleShare = (url: string) => {
    setUrl(url);
  };

  const handleClose = () => {
    setUrl(undefined);
  };

  const handleShareContent = (value: string) => {};

  const { setContainer } = useParams();

  return (
    <>
      {url && (
        <ShareDialogV2
          url={url}
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleClose,
          }}
          onClick={handleShareContent}
        />
      )}

      <DashboardLayout page="checkouts">
        <Stack spacing={2}>
          <Typography variant="h6">
            <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              LinkComponent={NextLink}
              variant="contained"
              onClick={() => {
                setContainer("commerce.checkouts.create");
              }}
            >
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          </Stack>
          <CheckoutsTable onShare={handleShare} />
        </Stack>
      </DashboardLayout>
    </>
  );
}
