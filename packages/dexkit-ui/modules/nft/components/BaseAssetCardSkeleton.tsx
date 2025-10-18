import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';

export function BaseAssetCardSkeleton() {
  const assetDetails = (
    <>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: { xs: '60%', sm: '100%' }, // Aspect ratio más pequeño en móviles
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            borderRadius: 'inherit'
          }}
        />
      </Box>
      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            lineHeight: 1.2,
            display: 'block',
            mb: 0.5
          }}
        >
          <Skeleton width="80%" />
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.3
          }}
        >
          <Skeleton width="90%" />
        </Typography>
      </CardContent>
    </>
  );

  return (
    <Card sx={{
      position: 'relative',
      height: '100%',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardActionArea sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 0
      }}>
        {assetDetails}
      </CardActionArea>
    </Card>
  );
}
