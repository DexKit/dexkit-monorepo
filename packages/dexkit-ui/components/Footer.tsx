import InstagramIcon from "@mui/icons-material/Instagram";

import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  useTheme
} from "@mui/material"; // always use @mui/material instead of @mui/system

import Facebook from "@mui/icons-material/Facebook";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Reddit from "@mui/icons-material/Reddit";
import YouTube from "@mui/icons-material/YouTube";
import Image from "next/image";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import Link from "@dexkit/ui/components/AppLink";
import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type {
  AppConfig,
  SocialMedia,
} from "@dexkit/ui/modules/wizard/types/config";
import { FooterVariants } from "./Footer/FooterVariants";
import NavbarMenu from "./Menu";

const XIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface Props {
  appNFT?: AssetAPI;
  appConfig: AppConfig;
  isPreview?: boolean;
}

export function Footer({ appConfig, isPreview, appNFT }: Props) {
  if ((appConfig as any).footerConfig?.variant && (appConfig as any).footerConfig.variant !== 'default') {
    return <FooterVariants appConfig={appConfig as any} isPreview={isPreview} appNFT={appNFT} />;
  }

  const theme = useTheme();
  const renderIcon = (media: SocialMedia) => {
    if (media?.type === "instagram") {
      return <InstagramIcon />;
    } else if (media?.type === "twitter") {
      return <XIcon />;
    } else if (media?.type === "reddit") {
      return <Reddit />;
    } else if (media?.type === "youtube") {
      return <YouTube />;
    } else if (media?.type === "linkedin") {
      return <LinkedIn />;
    } else if (media?.type === "facebook") {
      return <Facebook />;
    }
  };

  const renderLink = (media: SocialMedia) => {
    if (media?.type === "instagram") {
      return `https://instagram.com/${media?.handle}`;
    } else if (media?.type === "twitter") {
      return `https://twitter.com/${media?.handle}`;
    } else if (media.type === "reddit") {
      return `https://reddit.com/r/${media?.handle}`;
    } else if (media.type === "youtube") {
      return `https://youtube.com/channel/${media?.handle}`;
    } else if (media.type === "linkedin") {
      return `https://linkedin.com/company/${media.handle}`;
    } else if (media.type === "facebook") {
      return `https://facebook.com/${media.handle}`;
    }

    return "";
  };

  const renderCustomLink = (link?: string) => {
    if (link) {
      return link;
    }

    return "";
  };

  const showAppSignature = useMemo(() => {
    if (appConfig?.hide_powered_by === true) {
      return false;
    }
    return true;
  }, [appNFT, appConfig]);

  return (
    <Box
      py={2}
      sx={{
        bgcolor: "background.paper",
        minHeight: "50px",
        width: "100%",
      }}
    >
      <Container>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          spacing={2}
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
        >
          <Grid item>
            {appConfig.footerMenuTree ? (
              <Stack
                direction="row"
                sx={{
                  center: "right",
                  justifyContent: "flex-end",
                }}
                alignItems="center"
                spacing={2}
              >
                {appConfig.footerMenuTree.map((m, key) =>
                  m.children ? (
                    <NavbarMenu menu={m} key={key} />
                  ) : (
                    <Link
                      color="inherit"
                      href={isPreview ? "#" : m.href || "/"}
                      key={key}
                      aria-label={`social media link ${m.name}`}
                      target={m.type === "External" ? "_blank" : undefined}
                    >
                      <FormattedMessage
                        id={m.name.toLowerCase()}
                        defaultMessage={m.name}
                      />
                    </Link>
                  )
                )}
              </Stack>
            ) : (
              <Link
                href={isPreview ? "" : "https://dexkit.com/contact-us/"}
                color="inherit"
                target="_blank"
              >
                <FormattedMessage
                  id="contact.us"
                  defaultMessage="Contact us"
                  description="Contact us"
                />
              </Link>
            )}
          </Grid>
          {showAppSignature && (
            <Grid item>
              <Typography variant="body1" align="center">
                <Link href="/" color="primary">
                  {appConfig.name}
                </Link>{" "}
                <FormattedMessage
                  id="made.with.love.by"
                  defaultMessage="made with ❤️ by"
                  description="made with ❤️ by"
                />{" "}
                <Link
                  variant="inherit"
                  href={isPreview ? "#" : "https://www.dexkit.com"}
                  target="_blank"
                  color="inherit"
                >
                  <strong>DexKit</strong>
                </Link>
              </Typography>
            </Grid>
          )}
          <Grid item>
            <Stack direction="row" spacing={1}>
              {appConfig?.social &&
                appConfig.social.map((media, index) => (
                  <IconButton
                    key={index}
                    href={renderLink(media)}
                    LinkComponent={Link}
                    target="_blank"
                    size="small"
                  >
                    {renderIcon(media)}
                  </IconButton>
                ))}
              {appConfig?.social_custom &&
                appConfig.social_custom.length > 0 &&
                appConfig.social_custom
                  .filter((m) => m?.link !== undefined)
                  .map((media, index) => (
                    <IconButton
                      key={index}
                      href={renderCustomLink(media?.link)}
                      LinkComponent={Link}
                      target="_blank"
                      size="small"
                    >
                      <Image
                        src={media?.iconUrl}
                        alt={media?.label || ""}
                        height={24}
                        width={24}
                      />
                    </IconButton>
                  ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
