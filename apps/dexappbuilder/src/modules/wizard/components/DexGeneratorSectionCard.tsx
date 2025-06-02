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
}

export default function DexGeneratorSectionCard({
  id,
  name,
  selected,
  onClick,
  type,
  chainId,
}: DexGeneratorSectionCardProps) {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            direction="row"
          >
            <Box>
              {type && (
                <Typography variant="caption" color="primary" component="div">
                  {type.toUpperCase()}
                </Typography>
              )}
              <Typography variant="body1" fontWeight="bold">
                {name}
              </Typography>
            </Box>
            <Chip label={NETWORK_NAME(chainId)} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
