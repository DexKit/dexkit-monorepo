import {
  Avatar,
  AvatarGroup,
  ButtonBase,
  Stack,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";

import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { useForceThemeMode } from "@dexkit/ui/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface PairButtonProps {
  quoteToken: Token;
  baseToken: Token;
  onClick?: () => void;
}

export default function PairButton({
  quoteToken,
  baseToken,
  onClick,
}: PairButtonProps) {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;
  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ButtonBase
      onClick={onClick}
      disabled={!onClick}
      data-pair-button="true"
      sx={{
        p: { xs: theme.spacing(0.75), sm: theme.spacing(1), md: theme.spacing(1.5) },
        borderRadius: { xs: Number(theme.shape.borderRadius) * 1.5, sm: Number(theme.shape.borderRadius) * 2 },
        backgroundColor: theme.palette.action.hover,
        border: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create([
          'background-color',
          'border-color',
          'box-shadow',
          'transform'
        ], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          backgroundColor: theme.palette.action.selected,
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          transform: { xs: 'none', sm: `translateY(-${theme.spacing(0.125)})` },
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: theme.shadows[1],
        },
        '&:disabled': {
          cursor: 'default',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.divider,
            boxShadow: 'none',
            transform: 'none',
          },
        },
        minWidth: 'fit-content',
        maxWidth: { xs: 'none', sm: theme.spacing(31.25), md: 'none' },
      }}
    >
      {isMobile ? (
        <Stack
          direction="row"
          spacing={theme.spacing(0.75)}
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Avatar
            src={
              baseToken.logoURI
                ? baseToken.logoURI
                : TOKEN_ICON_URL(baseToken.address, baseToken.chainId)
            }
            alt={`${baseToken.symbol} logo`}
            sx={{
              width: theme.spacing(2.5),
              height: theme.spacing(2.5),
              backgroundColor: theme.palette.grey[100],
            }}
          />

          <Stack
            direction="column"
            spacing={0}
            alignItems="flex-start"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Typography
              variant="body2"
              data-pair-button="true"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                color: isDark ? '#ffffff' : '#000000',
                lineHeight: 1.1,
                fontSize: theme.typography.caption.fontSize,
              }}
              noWrap
            >
              {baseToken.symbol.toUpperCase()} / {quoteToken.symbol.toUpperCase()}
            </Typography>

            <Typography
              variant="caption"
              data-pair-button="true"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666666',
                fontSize: theme.typography.overline.fontSize,
                lineHeight: 1,
              }}
              noWrap
            >
              {baseToken.name} / {quoteToken.name}
            </Typography>
          </Stack>

          {onClick && (
            <ExpandMoreIcon
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666666',
                fontSize: theme.spacing(2),
              }}
            />
          )}
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={{ sm: theme.spacing(1), md: theme.spacing(1.5) }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <AvatarGroup
            max={2}
            sx={{
              '& .MuiAvatar-root': {
                width: { sm: theme.spacing(2.75), md: theme.spacing(3) },
                height: { sm: theme.spacing(2.75), md: theme.spacing(3) },
                border: `${theme.spacing(0.1875)} solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[1],
              },
            }}
          >
            <Avatar
              src={
                baseToken.logoURI
                  ? baseToken.logoURI
                  : TOKEN_ICON_URL(baseToken.address, baseToken.chainId)
              }
              alt={`${baseToken.symbol} logo`}
              sx={{
                backgroundColor: theme.palette.grey[100],
              }}
            />
            <Avatar
              src={
                quoteToken.logoURI
                  ? quoteToken.logoURI
                  : TOKEN_ICON_URL(quoteToken.address, quoteToken.chainId)
              }
              alt={`${quoteToken.symbol} logo`}
              sx={{
                backgroundColor: theme.palette.grey[100],
              }}
            />
          </AvatarGroup>

          <Stack
            direction="column"
            spacing={theme.spacing(0.125)}
            alignItems="flex-start"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Typography
              variant="body2"
              data-pair-button="true"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                color: isDark ? '#ffffff' : '#000000',
                lineHeight: 1.2,
                fontSize: { sm: theme.typography.body2.fontSize, md: theme.typography.body1.fontSize },
              }}
              noWrap
            >
              {baseToken.symbol.toUpperCase()} / {quoteToken.symbol.toUpperCase()}
            </Typography>

            <Typography
              variant="caption"
              data-pair-button="true"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666666',
                fontSize: theme.typography.caption.fontSize,
                lineHeight: 1,
              }}
              noWrap
            >
              {baseToken.name} / {quoteToken.name}
            </Typography>
          </Stack>

          {onClick && (
            <ExpandMoreIcon
              sx={{
                color: isDark ? '#ffffff' : '#000000',
                fontSize: { sm: theme.spacing(2.5), md: theme.spacing(3) },
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.short,
                }),
                '.MuiButtonBase-root:hover &': {
                  transform: 'rotate(180deg)',
                },
              }}
            />
          )}
        </Stack>
      )}
    </ButtonBase>
  );
}
