import { AppPage, MenuTree } from '@dexkit/ui/modules/wizard/types/config';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItemTree from './MenuItemTree';

import SelectIconDialog from '@dexkit/ui/components/dialogs/SelectIconDialog';
import EditMenuPageDialog from '../../dialogs/EditMenuPageDialog';

interface Props {
  menu: MenuTree[];
  pages: { [key: string]: AppPage };
  onSetMenu: Dispatch<SetStateAction<MenuTree[]>>;
}

export default function MenuSection(props: Props) {
  const { menu, onSetMenu, pages } = props;
  const [isAddOpen, setIsAddOpen] = useState(false);

  const onAddMenu = (item: MenuTree, fIndex?: number) => {
    const newMenu = [...menu, item];

    onSetMenu(newMenu);
  };

  const handleAddMenuPage = () => {
    setIsAddOpen(true);
  };

  const handleClose = () => {
    setIsAddOpen(false);
  };

  const handleUp = (index: number) => {
    return () => {
      const newItem = [...menu];

      const currItem = newItem[index];
      const beforeItem = newItem[index - 1];

      newItem[index] = beforeItem;
      newItem[index - 1] = currItem;

      onSetMenu(newItem);
    };
  };

  const handleDown = (index: number) => {
    return () => {
      const items = [...menu];

      const currItem = items[index];
      const beforeItem = items[index + 1];

      items[index] = beforeItem;
      items[index + 1] = currItem;

      onSetMenu(items);
    };
  };

  const handleRemove = (index: number) => {
    return () => {
      const items = [...menu];

      items.splice(index, 1);

      onSetMenu(items);
    };
  };

  const handleUpdateItem = (index: number) => {
    return (newItem: MenuTree) => {
      const newMenu = [...menu];

      newMenu[index] = newItem;

      onSetMenu(newMenu);
    };
  };

  return (
    <Stack spacing={2}>
      {isAddOpen && (
        <EditMenuPageDialog
          dialogProps={{
            open: isAddOpen,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleClose,
          }}
          pages={pages}
          onCancel={handleClose}
          onSubmit={onAddMenu}
        />
      )}

      <Button
        variant="outlined"
        onClick={handleAddMenuPage}
        startIcon={<AddIcon />}
      >
        <FormattedMessage id="add.menu" defaultMessage="Add menu" />
      </Button>
      {menu?.map((item, index, arr) => (
        <MenuItemTree
          key={index}
          pages={pages}
          depth={0}
          item={item}
          onDown={handleDown(index)}
          onUp={handleUp(index)}
          onRemove={handleRemove(index)}
          onUpdateItem={handleUpdateItem(index)}
          disableUp={index === 0}
          disableDown={index === arr.length - 1}
          renderSelectIcon={(onConfirm, onClose, open) => (
            <SelectIconDialog
              DialogProps={{
                open,
                onClose: onClose,
                fullWidth: true,
                maxWidth: 'sm',
              }}
              onConfirm={onConfirm}
            />
          )}
          renderEdit={(onConfirm, onClose, open, item: MenuTree) => (
            <EditMenuPageDialog
              dialogProps={{
                open,
                onClose: onClose,
                fullWidth: true,
                maxWidth: 'sm',
              }}
              onSubmit={onConfirm}
              onCancel={onClose}
              value={item}
              pages={pages}
            />
          )}
        />
      ))}
    </Stack>
  );
}
