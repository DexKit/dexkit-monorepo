import {
  Box,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';

interface SiteCardSkeletonProps {
  count?: number;
}

export const SiteCardSkeleton: React.FC<SiteCardSkeletonProps> = ({ count = 1 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const skeletonCount = isMobile ? 2 : isTablet ? 3 : count;

  return (
    <>
      {Array.from({ length: skeletonCount }, (_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '& > .MuiCard-root': {
              width: '100%',
              height: '100%'
            }
          }}
        >
          <Card
            sx={{
              maxWidth: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              minHeight: { xs: '280px', sm: '320px', md: '360px' },
              overflow: 'hidden'
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={isMobile ? 120 : isTablet ? 130 : 140}
              animation="wave"
              sx={{
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)'
              }}
            />

            <CardContent
              sx={{
                flexGrow: 1,
                p: { xs: 1.5, sm: 2.5, md: 3 },
                '&:last-child': { pb: { xs: 1.5, sm: 2.5, md: 3 } }
              }}
            >
              <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={isMobile ? 20 : 24}
                  animation="wave"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)'
                  }}
                />

                <Stack spacing={0.5}>
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={isMobile ? 14 : 16}
                    animation="wave"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={isMobile ? 14 : 16}
                    animation="wave"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={isMobile ? 14 : 16}
                    animation="wave"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.06)'
                    }}
                  />
                </Stack>
              </Stack>
            </CardContent>

            <CardActions
              sx={{
                p: { xs: 1, sm: 2, md: 2.5 },
                pt: 0,
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1.5 }
              }}
            >
              <Stack
                spacing={isMobile ? 1 : 2}
                direction={isMobile ? 'column' : 'row'}
                sx={{
                  width: '100%',
                  alignItems: isMobile ? 'stretch' : 'center'
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={isMobile ? '100%' : 80}
                  height={isMobile ? 32 : 36}
                  animation="wave"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)'
                  }}
                />

                <Skeleton
                  variant="rectangular"
                  width={isMobile ? '100%' : 80}
                  height={isMobile ? 32 : 36}
                  animation="wave"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)'
                  }}
                />
              </Stack>
            </CardActions>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default SiteCardSkeleton;
