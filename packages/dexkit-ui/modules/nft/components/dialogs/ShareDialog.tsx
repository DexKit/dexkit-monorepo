import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RedditIcon from "@mui/icons-material/Reddit";
import ShareIcon from "@mui/icons-material/Share";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { FormattedMessage, useIntl } from "react-intl";

import { copyToClipboard } from "@dexkit/core/utils/browser";
import { AppDialogTitle } from "../../../../components/AppDialogTitle";
import CopyIconButton from "../../../../components/CopyIconButton";

interface Props {
  dialogProps: DialogProps;
  url?: string;
}

function ShareDialog({ dialogProps, url }: Props) {
  const { onClose } = dialogProps;
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  const handleCopy = () => {
    if (url !== undefined) {
      copyToClipboard(url);
    }
  };

  const shareText = "Check out this amazing NFT!";
  const encodedUrl = encodeURIComponent(url || "");
  const encodedText = encodeURIComponent(shareText);

  const socialMediaOptions = [
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon />,
      color: "#0077B5",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      color: "#0088CC",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "#25D366",
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Reddit",
      icon: <RedditIcon />,
      color: "#FF4500",
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    },
    {
      name: "Email",
      icon: <EmailIcon />,
      color: "#EA4335",
      url: `mailto:?subject=${encodedText}&body=${encodedText}%20${encodedUrl}`,
    },
  ];

  const handleSocialShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <Dialog {...dialogProps} maxWidth="sm" fullWidth>
      <AppDialogTitle
        icon={<ShareIcon />}
        title={
          <FormattedMessage
            id="share"
            defaultMessage="Share"
            description="Share dialog title"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="share.link"
                defaultMessage="Share Link"
                description="Share link section title"
              />
            </Typography>
            <TextField
              fullWidth
              value={url}
              variant="outlined"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyIconButton
                      iconButtonProps={{
                        onClick: handleCopy,
                        size: "small",
                      }}
                      tooltip={formatMessage({
                        id: "copy",
                        defaultMessage: "Copy",
                        description: "Copy text",
                      })}
                      activeTooltip={formatMessage({
                        id: "copied",
                        defaultMessage: "Copied!",
                        description: "Copied text",
                      })}
                    >
                      <FileCopyIcon />
                    </CopyIconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.background.default,
                },
              }}
            />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="share.social"
                defaultMessage="Share on Social Media"
                description="Social media section title"
              />
            </Typography>
            <Grid container spacing={2}>
              {socialMediaOptions.map((social) => (
                <Grid size={{ xs: 6, sm: 4 }} key={social.name}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                    onClick={() => handleSocialShare(social.url)}
                  >
                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                      <IconButton
                        sx={{
                          color: social.color,
                          fontSize: "2rem",
                          mb: 1,
                        }}
                        size="large"
                      >
                        {social.icon}
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {social.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="share.quick"
                defaultMessage="Quick Actions"
                description="Quick actions section title"
              />
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<FileCopyIcon />}
                onClick={handleCopy}
                sx={{ minWidth: 120 }}
              >
                <FormattedMessage
                  id="copy.link"
                  defaultMessage="Copy Link"
                  description="Copy link button"
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: shareText,
                      text: shareText,
                      url: url,
                    });
                  }
                }}
                sx={{ minWidth: 120 }}
              >
                <FormattedMessage
                  id="native.share"
                  defaultMessage="Native Share"
                  description="Native share button"
                />
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
