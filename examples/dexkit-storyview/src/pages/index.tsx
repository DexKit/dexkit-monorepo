import { useExecuteTransactionsDialog } from "@dexkit/ui/hooks";
import { Button, Container, Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

export default function TestPage() {
  const txDialog = useExecuteTransactionsDialog();

  const handleExecute = () => {
    txDialog.execute([
      {
        check: () => {
          return { hidden: true, conditions: ["approval"] };
        },
        action: async () => {
          return { conditions: ["approval"] };
        },
        title: { id: "pre-test", defaultMessage: "Pre test" },
      },
      {
        action: async () => {
          return {};
        },
        title: { id: "test", defaultMessage: "Test" },
        conditions: [
          {
            id: "approval",
            messageId: "needs.token.approval",
            defaultMessage: "Needs token approval",
          },
        ],
      },
    ]);
  };

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button onClick={handleExecute} variant="contained">
              <FormattedMessage id="execute" defaultMessage="Execute" />
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
