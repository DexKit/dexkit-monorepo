import InstagramIcon from '@mui/icons-material/Instagram';

import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'; // always use @mui/material instead of @mui/system

import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Reddit from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTube from '@mui/icons-material/YouTube';
import Image from 'next/image';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { AssetAPI } from 'src/types/nft';
import { AppConfig, SocialMedia } from '../types/config';
import Link from './Link';
import NavbarMenu from './Menu';

interface Props {
  appNFT?: AssetAPI;
  appConfig: AppConfig;
  isPreview?: boolean;
}

export function Footer({ appConfig, isPreview, appNFT }: Props) {
  const theme = useTheme();
  const renderIcon = (media: SocialMedia) => {
    if (media?.type === 'instagram') {
      return <InstagramIcon />;
    } else if (media?.type === 'twitter') {
      return <TwitterIcon />;
    } else if (media?.type === 'reddit') {
      return <Reddit />;
    } else if (media?.type === 'youtube') {
      return <YouTube />;
    } else if (media?.type === 'linkedin') {
      return <LinkedIn />;
    } else if (media?.type === 'facebook') {
      return <Facebook />;
    }
  };

  const renderLink = (media: SocialMedia) => {
    if (media?.type === 'instagram') {
      return `https://instagram.com/${media?.handle}`;
    } else if (media?.type === 'twitter') {
      return `https://twitter.com/${media?.handle}`;
    } else if (media.type === 'reddit') {
      return `https://reddit.com/r/${media?.handle}`;
    } else if (media.type === 'youtube') {
      return `https://youtube.com/channel/${media?.handle}`;
    } else if (media.type === 'linkedin') {
      return `https://linkedin.com/company/${media.handle}`;
    } else if (media.type === 'facebook') {
      return `https://facebook.com/${media.handle}`;
    }

    return '';
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
        bgcolor: 'background.paper',
        minHeight: '50px',
        width: '100%',
      }}
    >
      <Container>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          spacing={2}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
          <Grid item>
            {appConfig.footerMenuTree ? (
              <Stack
                direction="row"
                sx={{
                  center: 'right',
                  justifyContent: 'flex-end',
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
                      href={isPreview ? '#' : m.href || '/'}
                      key={key}
                      target={m.type === 'External' ? '_blank' : undefined}
                    >
                      <FormattedMessage
                        id={m.name.toLowerCase()}
                        defaultMessage={m.name}
                      />
                    </Link>
                  ),
                )}
              </Stack>
            ) : (
              <Link
                href={isPreview ? '' : 'https://dexkit.com/contact-us/'}
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
                </Link>{' '}
                <FormattedMessage
                  id="made.with.love.by"
                  defaultMessage="made with ❤️ by"
                  description="made with ❤️ by"
                />{' '}
                <Link
                  variant="inherit"
                  href={isPreview ? '#' : 'https://www.dexkit.com'}
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
                appConfig.social_custom.map((media, index) => (
                  <IconButton
                    key={index}
                    href={media.link}
                    LinkComponent={Link}
                    target="_blank"
                    size="small"
                  >
                    <Image
                      src={media.iconUrl}
                      height={theme.spacing(3)}
                      width={theme.spacing(3)}
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
