import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import { Box, CardMedia, Paper } from "@mui/material";
import { FormattedMessage } from "react-intl";

interface Props {
  src: string;
  poster?: string;
  showControls?: boolean;
}

export function AssetVideo({ src, poster, showControls = false }: Props) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        aspectRatio: "1",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <CardMedia
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        <Box
          component="video"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "background.default"
          }}
          autoPlay
          muted
          loop
          playsInline
          controls={showControls}
          poster={poster ? ipfsUriToUrl(poster) : undefined}
          src={ipfsUriToUrl(src)}
        >
          <FormattedMessage
            id="browser.not.support.video.tage"
            defaultMessage="Your browser does not support the video tag."
          />
        </Box>
      </CardMedia>
    </Paper>
  );
}
