import InstagramIcon from "@mui/icons-material/Instagram";

import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
      py={isMobile ? 4 : isTablet ? 3 : 2}
      sx={{
        bgcolor: "background.paper",
        minHeight: isMobile ? "120px" : isTablet ? "100px" : "60px",
        width: "100%",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          spacing={isMobile ? 3 : 2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
            py: isMobile ? 2 : 1
          }}
        >
          <Grid size={{ xs: 12, sm: 4 }} order={{ xs: 1, sm: 1 }}>
            {appConfig.footerMenuTree ? (
              <Stack
                direction={isMobile ? "row" : "row"}
                sx={{
                  justifyContent: isMobile ? "center" : "flex-start",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: isMobile ? 1 : 0
                }}
                spacing={isMobile ? 0 : 2}
              >
                {appConfig.footerMenuTree.map((m, key) =>
                  m.children ? (
                    <NavbarMenu menu={m} key={key} />
                  ) : (
                    <Link
                      color="inherit"
                      href={isPreview ? "#" : m.href || "/"}
                      key={key}
                      aria-label={`footer menu link ${m.name}`}
                      target={m.type === "External" ? "_blank" : undefined}
                      sx={{
                        fontSize: isMobile ? '0.9rem' : '0.875rem',
                        py: isMobile ? 0.75 : 0.5,
                        px: isMobile ? 1.5 : 1,
                        borderRadius: 2,
                        fontWeight: isMobile ? 500 : 400,
                        transition: 'all 0.2s ease-in-out',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          transform: isMobile ? 'translateY(-1px)' : 'none',
                          boxShadow: isMobile ? theme.shadows[2] : 'none'
                        }
                      }}
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
              <Stack
                direction="row"
                spacing={isMobile ? 2 : 1}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <Link
                  href={isPreview ? "" : "https://dexkit.com/contact-us/"}
                  color="inherit"
                  target="_blank"
                  sx={{
                    fontSize: isMobile ? '0.9rem' : '0.875rem',
                    py: isMobile ? 0.75 : 0.5,
                    px: isMobile ? 1.5 : 1,
                    borderRadius: 2,
                    fontWeight: isMobile ? 500 : 400,
                    transition: 'all 0.2s ease-in-out',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transform: isMobile ? 'translateY(-1px)' : 'none',
                      boxShadow: isMobile ? theme.shadows[2] : 'none'
                    }
                  }}
                >
                  <FormattedMessage
                    id="contact.us"
                    defaultMessage="Contact us"
                    description="Contact us"
                  />
                </Link>
                <Link
                  href={isPreview ? "#" : "/app-version"}
                  color="inherit"
                  sx={{
                    fontSize: isMobile ? '0.9rem' : '0.875rem',
                    py: isMobile ? 0.75 : 0.5,
                    px: isMobile ? 1.5 : 1,
                    borderRadius: 2,
                    fontWeight: isMobile ? 500 : 400,
                    transition: 'all 0.2s ease-in-out',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transform: isMobile ? 'translateY(-1px)' : 'none',
                      boxShadow: isMobile ? theme.shadows[2] : 'none'
                    }
                  }}
                >
                  App version
                </Link>
              </Stack>
            )}
          </Grid>

          {showAppSignature && (
            <Grid size={{ xs: 12, sm: 4 }} order={{ xs: 2, sm: 2 }}>
              <Typography
                variant={isMobile ? "body1" : "body2"}
                align="center"
                sx={{
                  fontSize: isMobile ? '0.9rem' : '0.875rem',
                  lineHeight: isMobile ? 1.6 : 1.4,
                  color: theme.palette.text.secondary,
                  px: isMobile ? 2 : 0
                }}
              >
                <Link href="/" color="primary" sx={{ fontWeight: 600 }}>
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
                  sx={{ fontWeight: 600 }}
                >
                  <strong>DexKit</strong>
                </Link>
              </Typography>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 4 }} order={{ xs: 3, sm: 3 }}>
            <Stack
              direction="row"
              spacing={isMobile ? 2 : 1.5}
              sx={{
                justifyContent: isMobile ? "center" : "flex-end",
                alignItems: "center"
              }}
            >
              {appConfig?.social &&
                appConfig.social.map((media, index) => (
                  <IconButton
                    key={index}
                    href={renderLink(media)}
                    LinkComponent={Link}
                    target="_blank"
                    size={isMobile ? "large" : "medium"}
                    sx={{
                      minWidth: isMobile ? '48px' : '44px',
                      minHeight: isMobile ? '48px' : '44px',
                      backgroundColor: theme.palette.action.hover,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                        transform: 'scale(1.1)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
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
                      size={isMobile ? "large" : "medium"}
                      sx={{
                        minWidth: isMobile ? '48px' : '44px',
                        minHeight: isMobile ? '48px' : '44px',
                        backgroundColor: theme.palette.action.hover,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                          transform: 'scale(1.1)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Image
                        src={media?.iconUrl}
                        alt={media?.label || ""}
                        height={isMobile ? 32 : 28}
                        width={isMobile ? 32 : 28}
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
