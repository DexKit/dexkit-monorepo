import { ChainId, useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseChainId } from "@dexkit/core/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Stack,
  Tooltip,
  styled,
} from "@mui/material";
import { useState } from "react";

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  p: 0.5,
  backgroundColor: theme.palette.grey[300],
}));

export interface SwapNetworkButtonsProps {
  activeChainIds: number[];
  chainId: number;
  onChangeNetwork: (chainId: ChainId) => void;
}

export default function SwapNetworkButtons({
  activeChainIds,
  chainId,
  onChangeNetwork,
}: SwapNetworkButtonsProps) {
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "more-button" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {activeChainIds
        .filter((_key, index) => !(!isMobile && index > 7))
        .map((key) => (
          <CustomIconButton
            onClick={() => onChangeNetwork(key)}
            key={key}
            sx={
              chainId === parseChainId(key)
                ? {
                  border: (theme) =>
                    `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: (theme) =>
                    theme.alpha(theme.palette.primary.main, 0.1),
                }
                : undefined
            }
          >
            <Tooltip title={NETWORKS[parseChainId(key)].name}>
              <Avatar
                sx={{ height: "1rem", width: "1rem" }}
                src={
                  NETWORKS[parseChainId(key)]
                    ? NETWORKS[parseChainId(key)].imageUrl
                    : undefined
                }
              />
            </Tooltip>
          </CustomIconButton>
        ))}
      {!isMobile && (
        <>
          <Button
            variant="outlined"
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            More
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List>
              {activeChainIds
                .filter((_key, index) => index > 7)
                .map((key) => (
                  <ListItem disablePadding key={key}>
                    <MenuItem
                      onClick={() => onChangeNetwork(key)}
                      value={parseChainId(key)}
                      key={parseChainId(key)}
                      sx={{
                        width: "100%",
                        backgroundColor: (theme) =>
                          chainId === parseChainId(key)
                            ? theme.alpha(theme.palette.primary.main, 0.1)
                            : undefined,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{ width: "1rem", height: "1rem" }}
                          src={NETWORKS[parseChainId(key)].imageUrl}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          NETWORKS[parseChainId(key)]
                            ? NETWORKS[parseChainId(key)].name
                            : undefined
                        }
                      />
                    </MenuItem>
                  </ListItem>
                ))}
            </List>
          </Popover>
        </>
      )}
    </Stack>
  );
}
