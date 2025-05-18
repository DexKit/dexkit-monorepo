import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export default function PagesMenu({
  currentPage,
  pages,
  onClickMenu,
}: {
  currentPage?: AppPage;
  pages: { [key: string]: AppPage };
  onClickMenu: (slug: string) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onClickItemMenu = (slug: string) => {
    onClickMenu(slug);
    handleClose();
  };

  const pageKeys = Object.keys(pages);

  const items = Object.keys(pages); /*.filter(
    (page) => pages[page].title !== currentPage?.title,
  )*/

  return (
    <div>
      {pageKeys.length > 1 ? (
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={isMobile ? "flex-start" : "center"}
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={isMobile ? 1 : 2}
        >
          <Button
            id="pages-show-button"
            aria-controls={open ? 'pages-show-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={open ? <ExpandLessIcon fontSize={isMobile ? "small" : "medium"} /> : <ExpandMoreIcon fontSize={isMobile ? "small" : "medium"} />}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? "0.875rem" : undefined,
              py: isMobile ? 0.75 : undefined,
            }}
          >
            <FormattedMessage
              id={'select.page'}
              defaultMessage={'Select page'}
            />
          </Button>
          <Typography variant={isMobile ? "body2" : "body1"}>
            <b>
              <FormattedMessage
                id={currentPage?.key || 'home'}
                defaultMessage={currentPage?.title || 'Home'}
              />
            </b>
          </Typography>
        </Stack>
      ) : (
        <Typography variant={isMobile ? "body2" : "body1"}>
          <FormattedMessage
            id={currentPage?.key || 'home'}
            defaultMessage={currentPage?.title || 'Home'}
          />
        </Typography>
      )}
      <Menu
        id="pages-show-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'ages-show-button',
        }}
      >
        {items.map((page, key) => (
          <MenuItem
            onClick={() => onClickItemMenu(pages[page]?.key || 'home')}
            key={key}
            sx={{
              fontSize: isMobile ? "0.875rem" : undefined,
              py: isMobile ? 0.75 : undefined,
              minHeight: isMobile ? "32px" : undefined,
            }}
          >
            <FormattedMessage
              id={pages[page]?.key || 'home'}
              defaultMessage={pages[page]?.title || 'Home'}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
