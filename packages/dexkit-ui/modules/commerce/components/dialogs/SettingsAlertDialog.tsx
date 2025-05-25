import {
  Backdrop,
  BackdropProps,
  Box,
  Button,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import useParams from "../containers/hooks/useParams";

export interface SettingsAlertDialogProps {
  BackdropProps: BackdropProps;
}

export default function SettingsAlertDialog({
  BackdropProps,
}: SettingsAlertDialogProps) {
  const { setContainer } = useParams();

  return (
    <Backdrop {...BackdropProps}>
      <Card sx={(theme) => ({ p: 2, width: { sm: theme.spacing(50) } })}>
        <Stack spacing={2} alignItems="center">
          <Box>
            <Typography gutterBottom textAlign="center" variant="h5">
              <FormattedMessage
                id="attention.required"
                defaultMessage="Attention Required"
              />
            </Typography>
            <Typography
              textAlign="center"
              variant="body1"
              color="text.secondary"
            >
              <FormattedMessage
                id="recipient.attention.required.subtitle"
                defaultMessage="Ensure recipient details are completed before processing the order."
              />
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setContainer("commerce.settings", undefined, {
                activeMenu: true,
              });
            }}
          >
            <FormattedMessage id="settings" defaultMessage="Settings" />
          </Button>
        </Stack>
      </Card>
    </Backdrop>
  );
}
