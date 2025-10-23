import { Token } from "@dexkit/core/types";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { TOKEN_ICON_URL, useIsMobile } from "@dexkit/core";
import { isAddressEqual } from "@dexkit/core/utils";
import TokenIcon from "@mui/icons-material/Token";
import { useExchangeContext } from "../hooks";

export interface SelectPairListProps {
  baseTokens: Token[];
  baseToken?: Token;
  quoteToken?: Token;
  onSelect: (quoteToken: Token) => void;
}

export default function SelectPairList({
  baseTokens,
  quoteToken,
  baseToken,
  onSelect,
}: SelectPairListProps) {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { variant, glassSettings } = useExchangeContext();
  const isGlassVariant = variant === "glass";
  const isDarkMode = mode === 'dark';
  const textColor = isDarkMode ? '#ffffff' : theme.palette.text.primary;

  return (
    <List disablePadding>
      {baseTokens.map((token, key) => (
        <ListItemButton
          divider
          selected={
            baseToken?.chainId == token.chainId &&
            isAddressEqual(token.address, baseToken?.address)
          }
          key={key}
          onClick={() => onSelect(token)}
          sx={{
            py: { xs: theme.spacing(1), sm: theme.spacing(1.5), md: theme.spacing(2) },
            px: { xs: theme.spacing(1.5), sm: theme.spacing(2), md: theme.spacing(3) },
            minHeight: { xs: theme.spacing(6), sm: theme.spacing(7), md: theme.spacing(8) },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            },
            '& .MuiListItemText-root': {
              '& .MuiTypography-root': {
                color: `${textColor} !important`,
              },
            },
          }}
        >
          <ListItemAvatar
            sx={{
              minWidth: { xs: theme.spacing(5), sm: theme.spacing(6), md: theme.spacing(7) },
            }}
          >
            <Avatar
              src={
                token.logoURI
                  ? token.logoURI
                  : TOKEN_ICON_URL(token.address, token.chainId)
              }
              sx={{
                width: { xs: theme.spacing(3.5), sm: theme.spacing(4), md: theme.spacing(5) },
                height: { xs: theme.spacing(3.5), sm: theme.spacing(4), md: theme.spacing(5) },
                border: `${theme.spacing(0.125)} solid ${theme.palette.divider}`,
              }}
            >
              <TokenIcon fontSize={isSmallScreen ? "small" : "medium"} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${token.symbol.toUpperCase()}/${quoteToken?.symbol.toUpperCase()}`}
            slotProps={{
              primary: {
                variant: isSmallScreen ? "body2" : "body1",
                fontSize: {
                  xs: theme.typography.body2.fontSize,
                  sm: theme.typography.body1.fontSize
                },
                fontWeight: theme.typography.fontWeightMedium,
                color: `${textColor} !important`,
              }
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
