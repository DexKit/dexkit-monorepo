import { Box, Button, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import NextLink from "next/link";
import CollectionsTable from "../CollectionsTable";
import DashboardLayout from "../layouts/DashboardLayout";
import useParams from "./hooks/useParams";

export default function CollectionsContainer() {
  const { setContainer } = useParams();

  return (
    <>
      <DashboardLayout page="collections">
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">
              <FormattedMessage id="collections" defaultMessage="Collections" />
            </Typography>
            <Typography color="text.secondary" variant="body1">
              <FormattedMessage
                id="create.collections.description.text"
                defaultMessage="Create collections to showcase themed or promotional product groups."
              />
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              LinkComponent={NextLink}
              onClick={() => {
                setContainer("commerce.products.collection.create");
              }}
              variant="contained"
            >
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          </Stack>
          <CollectionsTable />
        </Stack>
      </DashboardLayout>
    </>
  );
}
