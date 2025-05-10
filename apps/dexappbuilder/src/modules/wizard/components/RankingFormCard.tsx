import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

interface RankingFormCardProps {
  id: number;
  title?: string;
  description?: string;
  selected?: boolean;
  onClick: (id: number, title?: string) => void;
}

export default function RankingFormCard({
  id,
  title,
  description,
  selected,
  onClick,
}: RankingFormCardProps) {
  return (
    <Card
      sx={{
        borderColor: (theme) =>
          selected ? theme.palette.primary.main : undefined,
      }}
    >
      <CardActionArea onClick={() => onClick(id, title)}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h5">
                #{id || ' '} - {title || ' '}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {description || ' '}
              </Typography>
            </Box>
            {selected && <CheckCircle fontSize="large" color="primary" />}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
