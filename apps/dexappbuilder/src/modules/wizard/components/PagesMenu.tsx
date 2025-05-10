import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack, Typography } from '@mui/material';
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
          direction="row"
          justifyContent="center"
          alignItems={'center'}
          spacing={2}
        >
          <Button
            id="pages-show-button"
            aria-controls={open ? 'pages-show-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <FormattedMessage
              id={'select.page'}
              defaultMessage={'Select page'}
            />
          </Button>
          <Typography>
            <b>
              <FormattedMessage
                id={currentPage?.key || 'home'}
                defaultMessage={currentPage?.title || 'Home'}
              />
            </b>
          </Typography>
        </Stack>
      ) : (
        <Typography>
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
