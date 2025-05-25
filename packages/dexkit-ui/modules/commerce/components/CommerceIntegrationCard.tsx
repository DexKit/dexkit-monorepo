import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { CommerceConfig } from "../../wizard/types/config";
import CommerceIntegrationForm from "./CommerceIntegrationForm";

export interface CommerceIntegrationCardProps {
  commerce?: CommerceConfig;
  onSave: (config: CommerceConfig) => void;
}

export default function CommerceIntegrationCard({
  commerce,
  onSave,
}: CommerceIntegrationCardProps) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography gutterBottom variant="h6" fontWeight="bold">
                <FormattedMessage id="ecommerce" defaultMessage="E-Commerce" />
              </Typography>
              <Chip
                label={<FormattedMessage id="beta" defaultMessage="BETA" />}
                sx={{ fontWeight: "bold" }}
                size="small"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="commerce.integration.card.description"
                defaultMessage="This feature allows you to integrate an online store into your DApp, accepting cryptocurrencies as a payment method. You can manage your store, including adding products, setting prices, organizing collections, and handling orders, all within the E-Commerce menu."
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CommerceIntegrationForm onSave={onSave} commerce={commerce} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
