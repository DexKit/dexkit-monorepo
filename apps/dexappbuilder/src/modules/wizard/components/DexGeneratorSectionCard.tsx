import { NETWORK_NAME } from '@dexkit/core/constants/networks';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

export interface DexGeneratorSectionCardProps {
  id: number;
  name?: string;
  selected?: boolean;
  onClick: () => void;
  type?: string;
  chainId?: number;
  isMobile?: boolean;
}

export default function DexGeneratorSectionCard({
  id,
  name,
  selected,
  onClick,
  type,
  chainId,
  isMobile,
}: DexGeneratorSectionCardProps) {
  const theme = useTheme();

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent sx={isMobile ? { padding: theme.spacing(1, 1.5) } : {}}>
          <Stack
            spacing={isMobile ? 1 : 2}
            alignItems="center"
            justifyContent="space-between"
            direction="row"
          >
            <Box>
              {type && (
                <Typography
                  variant="caption"
                  color="primary"
                  component="div"
                  sx={isMobile ? { fontSize: theme.typography.caption.fontSize } : {}}
                >
                  {type.toUpperCase()}
                </Typography>
              )}
              <Typography
                variant={isMobile ? "body2" : "body1"}
                fontWeight="bold"
                sx={isMobile ? { fontSize: theme.typography.caption.fontSize } : {}}
              >
                {name}
              </Typography>
            </Box>
            <Chip
              label={NETWORK_NAME(chainId)}
              size={isMobile ? "small" : "medium"}
              sx={isMobile ? {
                height: theme.spacing(2.5),
                '& .MuiChip-label': {
                  fontSize: theme.typography.caption.fontSize,
                  padding: theme.spacing(0, 0.75)
                }
              } : {}}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
