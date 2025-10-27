import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import { CardMedia, Paper } from "@mui/material";
import { FormattedMessage } from "react-intl";

interface Props {
  src: string;
  poster?: string;
}

export function AssetAudio({ src, poster }: Props) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        aspectRatio: "1",
        position: "relative",
        overflow: "hidden",
        background: poster
          ? `url(${ipfsUriToUrl(poster)}) center center / cover`
          : (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <CardMedia
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: (theme) => theme.spacing(2),
        }}
      >
        <audio
          controls
          style={{
            width: "100%",
            maxWidth: "600px",
          }}
          src={ipfsUriToUrl(src)}
        >
          <FormattedMessage
            id="browser.not.support.audio.tage"
            defaultMessage="Your browser does not support the audio tag."
          />
        </audio>
      </CardMedia>
    </Paper>
  );
}
