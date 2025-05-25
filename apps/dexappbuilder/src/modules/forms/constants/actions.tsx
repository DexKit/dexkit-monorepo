import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import Search from '@mui/icons-material/SearchOutlined';
import Settings from '@mui/icons-material/SettingsOutlined';
import Share from '@mui/icons-material/ShareOutlined';

export const ADMIN_FORMS_ACTION_LIST = [
  {
    icon: <Settings />,
    value: 'set',
    title: {
      id: 'set',
      defaultMessage: 'Set',
    },
  },
  {
    icon: <FileCopyIcon />,
    value: 'clone',
    title: {
      id: 'clone.form',
      defaultMessage: 'Clone form',
    },
  },
  {
    icon: <Share />,
    value: 'share',
    title: {
      id: 'share',
      defaultMessage: 'Share',
    },
  },
  {
    icon: <Search />,
    value: 'explorer',
    title: {
      id: 'explore.block',
      defaultMessage: 'Explore block',
    },
  },
  {
    icon: <DeleteOutlined color="error" />,
    value: 'delete',
    title: {
      id: 'delete',
      defaultMessage: 'Delete',
    },
  },
];
