import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, Paper } from "@mui/material";
import { FormattedMessage } from "react-intl";
export interface SelectTabProps {
  imageUrl: string;
  onGenVariants: () => void;
  onEdit: () => void;
}

export default function SelectTab({
  imageUrl,
  onEdit,
  onGenVariants,
}: SelectTabProps) {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={{ xs: 12, sm: 6 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <Paper>
              <img
                src={imageUrl}
                style={{ width: "100%", aspectRatio: "1/1" }}
              />
            </Paper>
          </Grid>
          <Grid size={6}>
            <Button
              onClick={onGenVariants}
              startIcon={<ContentCopyIcon />}
              fullWidth
              variant="outlined"
            >
              <FormattedMessage id="variants" defaultMessage="Variants" />
            </Button>
          </Grid>
          <Grid size={6}>
            <Button
              onClick={onEdit}
              startIcon={<EditIcon />}
              fullWidth
              variant="outlined"
            >
              <FormattedMessage id="ai.edit" defaultMessage="AI Edit" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
