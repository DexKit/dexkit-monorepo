import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import FileDownload from '@mui/icons-material/FileDownload';
import Visibility from '@mui/icons-material/Visibility';
import React from 'react';

export const ADMIN_TABLE_LIST: {
  value: string;
  icon: React.ReactNode;
  text: { id: string; defaultMessage: string };
}[] = [
  {
    value: 'preview',
    icon: <Visibility />,
    text: { id: 'preview', defaultMessage: 'Preview' },
  },
  {
    value: 'edit',
    icon: <Edit />,
    text: { id: 'edit', defaultMessage: 'Edit' },
  },
  {
    value: 'export',
    icon: <FileDownload />,
    text: { id: 'export', defaultMessage: 'Export' },
  },
  {
    value: 'delete',
    icon: <Delete color="error" />,
    text: { id: 'delete', defaultMessage: 'Delete' },
  },
];
