import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

export interface UserContractFormCard {
  id: number;
  name?: string;
  description?: string;
  selected?: boolean;
  onClick: (id: number) => void;
}

export default function UserContractFormCard({
  id,
  name,
  description,
  selected,
  onClick,
}: UserContractFormCard) {
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
              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
            </Box>
            {selected && <CheckCircle fontSize="large" color="primary" />}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
