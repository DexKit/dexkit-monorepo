import { Box, Card, CardContent, Skeleton } from "@mui/material";
import { memo } from "react";

interface GlassNFTSkeletonProps {
  count?: number;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

export function GlassNFTSkeleton({
  count = 6,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff'
}: GlassNFTSkeletonProps) {
  return (
    <>
      {new Array(count).fill(null).map((_, index) => (
        <Box key={index} sx={{ position: 'relative' }}>
          <Card
            sx={{
              position: "relative",
              height: "100%",
              minHeight: "300px",
              borderRadius: "16px",
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
              backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)})`,
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                paddingTop: { xs: "60%", sm: "100%" }, // Aspect ratio más pequeño en móviles
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: `${textColor}22`,
                  borderRadius: "inherit"
                }}
              />
            </Box>

            <CardContent sx={{
              pb: "16px !important",
              p: { xs: 1, sm: 2 }
            }}>
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                sx={{
                  backgroundColor: `${textColor}33`,
                  mb: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              />

              <Skeleton
                variant="text"
                width="90%"
                height={24}
                sx={{
                  backgroundColor: `${textColor}33`,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              />
            </CardContent>
          </Card>
        </Box>
      ))}
    </>
  );
}

export default memo(GlassNFTSkeleton);