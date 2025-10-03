import { AppPage, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import Add from '@mui/icons-material/Add';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Image from '@mui/icons-material/Image';
import {
  Box,
  Collapse,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const EditMenuPageDialog = dynamic(
  () => import('../../dialogs/EditMenuPageDialog'),
  { ssr: false },
);

const SelectIconDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/SelectIconDialog'),
  { ssr: false },
);

const DynamicIcon = ({ iconName }: { iconName: string }) => {
  return <SvgIcon />;
};

export interface MenuItemTreeProps {
  item: MenuTree;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  onUpdateItem: (newItem: MenuTree) => void;
  pages: {
    [key: string]: AppPage;
  };
  depth: number;
  disableUp: boolean;
  disableDown: boolean;
  disableMenu?: boolean;
  renderSelectIcon: (
    onSelect: (iconName: string) => void,
    onClose: () => void,
    open: boolean,
  ) => React.ReactNode;
  renderEdit: (
    onSave: (item: MenuTree) => void,
    onClose: () => void,
    open: boolean,
    item: MenuTree,
  ) => React.ReactNode;
}

export default function MenuItemTree({
  item,
  depth,
  onUp,
  onDown,
  onRemove,
  onUpdateItem,
  disableUp,
  disableDown,
  pages,
  renderEdit,
  renderSelectIcon,
}: MenuItemTreeProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(true);

  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [showSelectIcons, setShowSelectIcons] = useState(false);

  const handleConfirmSelectIcon = (iconName: string) => {
    onUpdateItem({ ...item, data: { iconName } });
    setShowSelectIcons(false);
  };

  const handleConfirmEdit = (menuItem: MenuTree) => {
    onUpdateItem({ ...menuItem });
    setIsOpenEdit(false);
  };

  const handleCloseEdit = () => setIsOpenEdit(false);

  const handleShowSelectIcon = () => {
    setShowSelectIcons(true);
  };

  const handleCloseSelectIcon = () => {
    setShowSelectIcons(false);
  };

  const handleUp = (index: number) => {
    return () => {
      const newItem = { ...item };

      if (newItem.children) {
        const currItem = newItem.children[index];
        const beforeItem = newItem.children[index - 1];

        newItem.children[index] = beforeItem;
        newItem.children[index - 1] = currItem;
      }

      onUpdateItem(newItem);
    };
  };

  const handleDown = (index: number) => {
    return () => {
      const newItem = { ...item };

      if (newItem.children) {
        const currItem = newItem.children[index];
        const beforeItem = newItem.children[index + 1];

        newItem.children[index] = beforeItem;
        newItem.children[index + 1] = currItem;
      }

      onUpdateItem(newItem);
    };
  };

  const handleRemove = (index: number) => {
    return () => {
      const newItem = { ...item };

      if (newItem.children) {
        newItem.children.splice(index, 1);
      }

      onUpdateItem(newItem);
    };
  };

  const handleUpdateItem = (index: number) => {
    return (newItem: MenuTree) => {
      const updatedItem = { ...item };

      if (updatedItem.children) {
        updatedItem.children[index] = { ...newItem };
      }

      onUpdateItem(updatedItem);
    };
  };

  const handleAdd = (newItem: MenuTree, fatherIndex?: number | undefined) => {
    const updatedItem = { ...item };

    if (updatedItem.children) {
      updatedItem.children.push(newItem);
    } else {
      updatedItem.children = [newItem];
    }

    onUpdateItem(updatedItem);
  };

  const renderOptions = () => {
    return (
      <Stack
        spacing={isMobile ? 0.25 : 0.5}
        alignItems="center"
        alignContent="center"
        direction="row"
      >
        <IconButton onClick={() => setIsOpenEdit(true)} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
          <Edit fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton disabled={disableUp} onClick={onUp} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
          <ArrowUpward fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton disabled={disableDown} onClick={onDown} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
          <ArrowDownward fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton onClick={onRemove} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
          <Delete fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Stack>
    );
  };

  if (item.type === 'Page') {
    return (
      <>
        {showSelectIcons &&
          renderSelectIcon(
            handleConfirmSelectIcon,
            handleCloseSelectIcon,
            showSelectIcons,
          )}
        {isOpenEdit &&
          renderEdit(handleConfirmEdit, handleCloseEdit, isOpenEdit, item)}
        <ListItem
          sx={{
            pl: depth * 2,
            py: isMobile ? 0.5 : 1,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: isMobile ? 1 : 0 }}>
            <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
              <IconButton onClick={handleShowSelectIcon} size={isMobile ? "small" : "medium"}>
                {item.data?.iconName ? (
                  <Icon fontSize={isMobile ? "small" : "medium"}>{item.data?.iconName}</Icon>
                ) : (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  (<Image fontSize={isMobile ? "small" : "medium"} />)
                )}
              </IconButton>
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                variant: isMobile ? 'body2' : 'body1'
              }}
            />
          </Box>
          {renderOptions()}
        </ListItem>
      </>
    );
  }

  if (item.type === 'External') {
    return (
      <>
        {showSelectIcons &&
          renderSelectIcon(
            handleConfirmSelectIcon,
            handleCloseSelectIcon,
            showSelectIcons,
          )}
        {isOpenEdit &&
          renderEdit(handleConfirmEdit, handleCloseEdit, isOpenEdit, item)}
        <ListItem
          sx={{
            pl: depth * 2,
            py: isMobile ? 0.5 : 1,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: isMobile ? 1 : 0 }}>
            <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
              <IconButton onClick={handleShowSelectIcon} size={isMobile ? "small" : "medium"}>
                {item.data?.iconName ? (
                  <Icon fontSize={isMobile ? "small" : "medium"}>{item.data?.iconName}</Icon>
                ) : (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  (<Image fontSize={isMobile ? "small" : "medium"} />)
                )}
              </IconButton>
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                variant: isMobile ? 'body2' : 'body1'
              }}
            />
          </Box>
          {renderOptions()}
        </ListItem>
      </>
    );
  }

  if (item.type === 'Menu') {
    return (
      <Box>
        {showSelectIcons &&
          renderSelectIcon(
            handleConfirmSelectIcon,
            handleCloseSelectIcon,
            showSelectIcons,
          )}
        {isOpenEdit &&
          renderEdit(handleConfirmEdit, handleCloseEdit, isOpenEdit, item)}
        {openAdd && (
          <EditMenuPageDialog
            key={`${depth}-dialog`}
            dialogProps={{
              open: openAdd,
              maxWidth: 'sm',
              fullWidth: true,
              onClose: () => setOpenAdd(false),
            }}
            pages={pages}
            onCancel={() => setOpenAdd(false)}
            onSubmit={handleAdd}
            fatherIndex={0}
            disableMenu={depth === 2}
          />
        )}
        <ListItem
          sx={{
            pl: depth * 2,
            py: isMobile ? 0.5 : 1,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: isMobile ? 1 : 0 }}>
            <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
              <IconButton onClick={handleShowSelectIcon} size={isMobile ? "small" : "medium"}>
                {item.data?.iconName ? (
                  <Icon fontSize={isMobile ? "small" : "medium"}>{item.data?.iconName}</Icon>
                ) : (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  (<Image fontSize={isMobile ? "small" : "medium"} />)
                )}
              </IconButton>
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                variant: isMobile ? 'body2' : 'body1'
              }}
            />
          </Box>
          <Stack
            spacing={isMobile ? 0.25 : 0.5}
            alignItems="center"
            alignContent="center"
            direction="row"
            sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}
          >
            <IconButton onClick={() => setIsOpenEdit(true)} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
              <Edit fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton disabled={disableUp} onClick={onUp} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
              <ArrowUpward fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton disabled={disableDown} onClick={onDown} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
              <ArrowDownward fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton onClick={onRemove} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
              <Delete fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton onClick={() => setOpenAdd(true)} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
              <Add fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton onClick={() => setExpanded((value: any) => !value)} size={isMobile ? "small" : "medium"} sx={isMobile ? { p: 0.5 } : {}}>
              {expanded ? (
                <ExpandLess fontSize={isMobile ? "small" : "medium"} />
              ) : (
                <ExpandMore fontSize={isMobile ? "small" : "medium"} />
              )}
            </IconButton>
          </Stack>
        </ListItem>
        <Collapse in={expanded} sx={{ pl: depth * 2 }}>
          <List>
            {item.children?.map((child, key, arr) => (
              <MenuItemTree
                renderEdit={renderEdit}
                pages={pages}
                item={child}
                key={`${depth}-${key}`}
                onDown={handleDown(key)}
                onUp={handleUp(key)}
                onRemove={handleRemove(key)}
                onUpdateItem={handleUpdateItem(key)}
                depth={depth + 1}
                disableUp={key === 0}
                disableDown={key === arr.length - 1}
                renderSelectIcon={renderSelectIcon}
              />
            ))}
          </List>
        </Collapse>
      </Box>
    );
  }

  return <></>;
}
