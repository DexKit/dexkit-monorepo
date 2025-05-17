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

  const renderVideo = () => {
    if (embedType === "youtube") {
      return <LazyYoutubeFrame url={videoUrl} title={title} />;
    }
  };

  return (
    <Box sx={{ py: isMobile ? 2 : 4, px: 0, width: '100%' }}>
      <Container maxWidth="xl" disableGutters sx={{ px: 0, width: '100%' }}>
        <Grid
          container
          spacing={isMobile ? 1 : 2}
          alignContent="flex-start"
          alignItems="flex-start"
          justifyContent="flex-start"
          direction={isMobile ? "column" : "row"}
        >
          {isMobile && (
            <Grid item xs={12} sx={{ mb: 1, pl: 1 }}>
              <Typography variant="h6" align="left" sx={{ fontWeight: "medium" }}>
                {title}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} sm={8} md={6}>
            <Box sx={{
              position: "relative",
              paddingTop: embedType === "youtube" ? "56.25%" : "auto", // 16:9 aspect ratio
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
          </Grid>

          {!isMobile && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h5" align="center">
                {title}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default VideoSection;
