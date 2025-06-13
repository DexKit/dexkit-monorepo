import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

export interface WidgetFormCard {
  id: number;
  name?: string;
  selected?: boolean;
  onClick: (id: number) => void;
}

export default function WidgetFormCard({
  id,
  name,
  selected,
  onClick,
}: WidgetFormCard) {
  return (
    <Card
      sx={{
        borderColor: (theme) =>
          selected ? theme.palette.primary.main : undefined,
      }}
    >
      <CardActionArea onClick={() => onClick(id)}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h5">
                #{id} - {name}
              </Typography>
            </Box>
            {selected && <CheckCircle fontSize="large" color="primary" />}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
