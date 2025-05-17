import { NETWORK_NAME } from '@dexkit/core/constants/networks';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
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
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent sx={isMobile ? { padding: '8px 12px' } : {}}>
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
                  sx={isMobile ? { fontSize: '0.7rem' } : {}}
                >
                  {type.toUpperCase()}
                </Typography>
              )}
              <Typography
                variant={isMobile ? "body2" : "body1"}
                fontWeight="bold"
                sx={isMobile ? { fontSize: '0.85rem' } : {}}
              >
                {name}
              </Typography>
            </Box>
            <Chip
              label={NETWORK_NAME(chainId)}
              size={isMobile ? "small" : "medium"}
              sx={isMobile ? {
                height: '20px',
                '& .MuiChip-label': {
                  fontSize: '0.7rem',
                  padding: '0 6px'
                }
              } : {}}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
