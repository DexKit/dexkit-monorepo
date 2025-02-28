import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import KeyIcon from "@mui/icons-material/Key";
import { Avatar, Box, Button, Skeleton, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { FormattedMessage } from "react-intl";

export default function BuyLockSkeleton() {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box
              display={"flex"}
              alignContent={"center"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                <Skeleton>
                  <Avatar src={" "} alt={"loading "}></Avatar>
                </Skeleton>
                <Skeleton>
                  <Typography>{"-"}</Typography>
                  <Typography sx={{ pl: 1 }} variant="body2">
                    symbol
                  </Typography>
                </Skeleton>
              </Box>

              <Box
                flexDirection={"row"}
                display={"flex"}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Skeleton>
                  <ConfirmationNumberIcon></ConfirmationNumberIcon>
                </Skeleton>
                <Skeleton>
                  <Typography>{"-"}</Typography>
                </Skeleton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display={"flex"} justifyContent={"center"}>
              <Skeleton>
                <Button variant={"contained"} startIcon={<KeyIcon />}>
                  <FormattedMessage id="buy.key" defaultMessage="Buy key" />
                </Button>
              </Skeleton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
