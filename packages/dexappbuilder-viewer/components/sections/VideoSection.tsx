import { LazyYoutubeFrame } from "@dexkit/ui/components";
import { VideoEmbedType } from "@dexkit/ui/modules/wizard/types/config";
import { Box, Container, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

interface Props {
  embedType?: VideoEmbedType;
  videoUrl?: string;
  title?: string;
}

export function VideoSection({ embedType, title, videoUrl }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getVideoType = (url: string): VideoEmbedType => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'custom';
  };

  const renderVideo = () => {
    if (!videoUrl) return null;
    
    const videoType = getVideoType(videoUrl);
    
    if (videoType === "youtube") {
      return <LazyYoutubeFrame url={videoUrl} title={title} />;
    } else {
      return (
        <iframe
          src={videoUrl}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
  };

  return (
    <Box py={isMobile ? 2 : 8}>
      <Container
        maxWidth={isMobile ? "xs" : "lg"}
        sx={{
          px: { xs: 0.75, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 4 }}>
          <Box sx={{ mb: isMobile ? 0.75 : 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 0.5 : 0
              }}
            >
              <Box sx={{ 
                mb: isMobile ? 0.25 : 0, 
                textAlign: isMobile ? "center" : "left",
                width: isMobile ? '100%' : 'auto'
              }}>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{
              position: "relative",
              width: '100%',
              maxWidth: isMobile ? '100%' : '800px',
              paddingTop: "56.25%",
              height: 0,
              overflow: "hidden",
              "& iframe": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none"
              }
            }}>
            {renderVideo()}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default VideoSection;
