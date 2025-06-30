import Facebook from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Reddit from "@mui/icons-material/Reddit";
import YouTube from "@mui/icons-material/YouTube";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  styled,
  SvgIcon,
  Typography,
  useTheme
} from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import Link from "@dexkit/ui/components/AppLink";
import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type {
  AppConfig,
  SocialMedia,
} from "@dexkit/ui/modules/wizard/types/config";
import NavbarMenu from "../Menu";

const XIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface FooterConfig {
  variant?: 'default' | 'glassmorphic';
  glassConfig?: {
    blurIntensity?: number;
    glassOpacity?: number;
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
  };
  customSignature?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    showAppName?: boolean;
    showLoveBy?: boolean;
  };
  layout?: {
    signaturePosition?: 'left' | 'center' | 'right';
    menuPosition?: 'left' | 'center' | 'right';
    socialMediaPosition?: 'left' | 'center' | 'right';
    borderRadius?: number;
  };
}

interface Props {
  appNFT?: AssetAPI;
  appConfig: AppConfig & { footerConfig?: FooterConfig };
  isPreview?: boolean;
}

const GlassmorphicContainer = styled(Box)<{
  blurIntensity: number;
  glassOpacity: number;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  borderRadius?: number;
}>(({ theme, blurIntensity, glassOpacity, backgroundColor, backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat, backgroundAttachment, borderRadius }) => {
  console.log('GlassmorphicContainer styled with blurIntensity:', blurIntensity, 'glassOpacity:', glassOpacity, 'borderRadius:', borderRadius);

  const appliedBorderRadius = borderRadius || 0;

  return {
    position: 'relative',
    minHeight: '50px',
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: `${appliedBorderRadius}px`,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: `${appliedBorderRadius}px`,
      background: backgroundImage
        ? `url(${backgroundImage})`
        : `
          linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%), 
          linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%), 
          linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
          ${backgroundColor || 'rgba(255, 255, 255, 0.05)'}
        `,
      backgroundSize: backgroundImage
        ? (backgroundSize || 'cover')
        : '20px 20px, 20px 20px, 20px 20px, 20px 20px, 100% 100%',
      backgroundPosition: backgroundImage
        ? (backgroundPosition || 'center')
        : '0 0, 0 10px, 10px -10px, -10px 0px, 0 0',
      backgroundRepeat: backgroundRepeat || 'no-repeat',
      backgroundAttachment: backgroundAttachment || 'scroll',
      pointerEvents: 'none',
      zIndex: 0,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: `${appliedBorderRadius}px`,
      background: `rgba(255, 255, 255, ${glassOpacity || 0.1})`,
      backdropFilter: `blur(${blurIntensity || 40}px) saturate(180%) brightness(1.05)`,
      WebkitBackdropFilter: `blur(${blurIntensity || 40}px) saturate(180%) brightness(1.05)`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.6)})`,
      boxShadow: `
        0 -2px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.8)}),
        inset 0 -1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.4)})
      `,
      pointerEvents: 'none',
      zIndex: 1,
    },

    '& > *': {
      position: 'relative',
      zIndex: 2,
    },

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      '&::before': {
        borderRadius: 0,
      },
      '&::after': {
        borderRadius: 0,
      },
    },
  };
});

const GlassmorphicIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['glassOpacity', 'textColor'].includes(prop as string),
})<{
  glassOpacity: number;
  textColor: string;
}>(({ theme, glassOpacity, textColor }) => ({
  color: textColor,
  backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)})`,
  backdropFilter: `blur(10px) saturate(150%)`,
  WebkitBackdropFilter: `blur(10px) saturate(150%)`,
  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.7)})`,
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.7)})`,
    backdropFilter: `blur(15px) saturate(170%)`,
    WebkitBackdropFilter: `blur(15px) saturate(170%)`,
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `
      0 8px 25px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})
    `,
  },
}));

const GlassmorphicLink = styled(Link)<{
  textColor: string;
  glassOpacity: number;
}>(({ theme, textColor, glassOpacity }) => ({
  color: textColor,
  textDecoration: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.4)})`,
  backdropFilter: `blur(8px) saturate(140%)`,
  WebkitBackdropFilter: `blur(8px) saturate(140%)`,
  border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.5)})`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textShadow: textColor.includes('255, 255, 255')
    ? '0 1px 2px rgba(0, 0, 0, 0.3)'
    : '0 1px 2px rgba(255, 255, 255, 0.3)',

  '&:hover': {
    backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.6)})`,
    backdropFilter: `blur(12px) saturate(160%)`,
    WebkitBackdropFilter: `blur(12px) saturate(160%)`,
    transform: 'translateY(-1px)',
    boxShadow: `
      0 6px 20px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})
    `,
  },
}));

export function FooterVariants({ appConfig, isPreview, appNFT }: Props) {
  const theme = useTheme();
  const footerConfig = appConfig.footerConfig || {};
  const variant = footerConfig.variant || 'default';

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

  const renderSignature = () => {
    const customSignature = footerConfig.customSignature;

    if (!showAppSignature && !customSignature?.enabled) {
      return null;
    }

    if (customSignature?.enabled) {
      return (
        <Typography variant="body1" align="center"
          sx={{
            color: footerConfig.glassConfig?.textColor || theme.palette.text.primary,
            textShadow: footerConfig.glassConfig?.textColor?.includes('255, 255, 255')
              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
              : '0 1px 2px rgba(255, 255, 255, 0.3)'
          }}>
          {customSignature.showAppName && (
            <>
              <Link href="/" color="inherit">
                {appConfig.name}
              </Link>{" "}
            </>
          )}
          {customSignature.showLoveBy && (
            <FormattedMessage
              id="made.with.love.by"
              defaultMessage="made with ❤️ by"
              description="made with ❤️ by"
            />
          )}
          {customSignature.showLoveBy && " "}
          <Link
            variant="inherit"
            href={isPreview ? "#" : (customSignature.link || "https://www.dexkit.com")}
            target="_blank"
            color="inherit"
          >
            <strong>{customSignature.text || "DexKit"}</strong>
          </Link>
        </Typography>
      );
    }

    return (
      <Typography variant="body1" align="center"
        sx={{
          color: footerConfig.glassConfig?.textColor || theme.palette.text.primary,
          textShadow: footerConfig.glassConfig?.textColor?.includes('255, 255, 255')
            ? '0 1px 2px rgba(0, 0, 0, 0.3)'
            : '0 1px 2px rgba(255, 255, 255, 0.3)'
        }}>
        <Link href="/" color="inherit">
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
    );
  };

  if (variant === 'glassmorphic') {
    const glassConfig = footerConfig.glassConfig || {};
    const layoutConfig = footerConfig.layout || {};
    const blurIntensity = glassConfig.blurIntensity || 40;
    const glassOpacity = glassConfig.glassOpacity || 0.10;
    const textColor = glassConfig.textColor || theme.palette.text.primary;
    const borderRadius = layoutConfig.borderRadius || 0;
    const signaturePosition = layoutConfig.signaturePosition || 'left';
    const menuPosition = layoutConfig.menuPosition || 'center';
    const socialMediaPosition = layoutConfig.socialMediaPosition || 'right';

    const renderSection = (position: 'left' | 'center' | 'right') => {
      const sections = [];

      if (menuPosition === position) {
        sections.push(
          <Box key="menu">
            {appConfig.footerMenuTree ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' }}
              >
                {appConfig.footerMenuTree.map((m, key) =>
                  m.children ? (
                    <NavbarMenu menu={m} key={key} />
                  ) : (
                    <GlassmorphicLink
                      color="inherit"
                      href={isPreview ? "#" : m.href || "/"}
                      key={key}
                      aria-label={`footer link ${m.name}`}
                      target={m.type === "External" ? "_blank" : undefined}
                      textColor={textColor}
                      glassOpacity={glassOpacity}
                    >
                      <FormattedMessage
                        id={m.name.toLowerCase()}
                        defaultMessage={m.name}
                      />
                    </GlassmorphicLink>
                  )
                )}
              </Stack>
            ) : (
              <GlassmorphicLink
                href={isPreview ? "" : "https://dexkit.com/contact-us/"}
                color="inherit"
                target="_blank"
                textColor={textColor}
                glassOpacity={glassOpacity}
              >
                <FormattedMessage
                  id="contact.us"
                  defaultMessage="Contact us"
                  description="Contact us"
                />
              </GlassmorphicLink>
            )}
          </Box>
        );
      }

      if (signaturePosition === position && (showAppSignature || footerConfig.customSignature?.enabled)) {
        sections.push(
          <Box key="signature" sx={{ textAlign: position }}>
            {renderSignature()}
          </Box>
        );
      }

      if (socialMediaPosition === position) {
        sections.push(
          <Box key="social" sx={{ display: 'flex', justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' }}>
            <Stack direction="row" spacing={1}>
              {appConfig?.social &&
                appConfig.social.map((media, index) => (
                  <Link
                    key={index}
                    href={renderLink(media)}
                    target="_blank"
                    sx={{ textDecoration: 'none' }}
                  >
                    <GlassmorphicIconButton
                      size="small"
                      glassOpacity={glassOpacity}
                      textColor={textColor}
                    >
                      {renderIcon(media)}
                    </GlassmorphicIconButton>
                  </Link>
                ))}
              {appConfig?.social_custom &&
                appConfig.social_custom.length > 0 &&
                appConfig.social_custom
                  .filter((m) => m?.link !== undefined)
                  .map((media, index) => (
                    <Link
                      key={index}
                      href={renderCustomLink(media?.link)}
                      target="_blank"
                      sx={{ textDecoration: 'none' }}
                    >
                      <GlassmorphicIconButton
                        size="small"
                        glassOpacity={glassOpacity}
                        textColor={textColor}
                      >
                        <Image
                          src={media?.iconUrl}
                          alt={media?.label || ""}
                          height={24}
                          width={24}
                        />
                      </GlassmorphicIconButton>
                    </Link>
                  ))}
            </Stack>
          </Box>
        );
      }

      return sections;
    };

    return (
      <GlassmorphicContainer
        py={2}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        backgroundColor={glassConfig.backgroundColor}
        backgroundImage={glassConfig.backgroundImage}
        backgroundSize={glassConfig.backgroundSize}
        backgroundPosition={glassConfig.backgroundPosition}
        backgroundRepeat={glassConfig.backgroundRepeat}
        backgroundAttachment={glassConfig.backgroundAttachment}
        borderRadius={borderRadius}
      >
        <Container>
          <Grid
            container
            alignItems="center"
            alignContent="center"
            spacing={2}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: 'space-between'
            }}
          >
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                {renderSection('left')}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack spacing={1} alignItems="center">
                {renderSection('center')}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
              <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
                {renderSection('right')}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </GlassmorphicContainer>
    );
  }

  const layoutConfig = footerConfig.layout || {};
  const borderRadius = layoutConfig.borderRadius || 0;
  const signaturePosition = layoutConfig.signaturePosition || 'left';
  const menuPosition = layoutConfig.menuPosition || 'center';
  const socialMediaPosition = layoutConfig.socialMediaPosition || 'right';

  const renderDefaultSection = (position: 'left' | 'center' | 'right') => {
    const sections = [];

    if (menuPosition === position) {
      sections.push(
        <Box key="menu">
          {appConfig.footerMenuTree ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' }}
            >
              {appConfig.footerMenuTree.map((m, key) =>
                m.children ? (
                  <NavbarMenu menu={m} key={key} />
                ) : (
                  <Link
                    color="inherit"
                    href={isPreview ? "#" : m.href || "/"}
                    key={key}
                    aria-label={`footer link ${m.name}`}
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
        </Box>
      );
    }

    if (signaturePosition === position && (showAppSignature || footerConfig.customSignature?.enabled)) {
      sections.push(
        <Box key="signature" sx={{ textAlign: position }}>
          {renderSignature()}
        </Box>
      );
    }

    if (socialMediaPosition === position) {
      sections.push(
        <Box key="social" sx={{ display: 'flex', justifyContent: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start' }}>
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
        </Box>
      );
    }

    return sections;
  };

  return (
    <Box
      py={2}
      sx={{
        bgcolor: "background.paper",
        minHeight: "50px",
        width: "100%",
        borderRadius: `${borderRadius}px`,
      }}
    >
      <Container>
        <Grid
          container
          alignItems="center"
          alignContent="center"
          spacing={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: 'space-between'
          }}
        >
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {renderDefaultSection('left')}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={1} alignItems="center">
              {renderDefaultSection('center')}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
              {renderDefaultSection('right')}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 