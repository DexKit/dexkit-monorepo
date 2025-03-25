import { CallReceived } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';

interface Props {
  onPaste: (data: string) => void;
}

export default function PasteIconButton(props: Props) {
  const { onPaste } = props;

  const handlePaste = useCallback(() => {
    navigator.clipboard
      .readText()
      .then((text) => {
        onPaste(text);
      })
      .catch((err) => {
        onPaste('');
      });
  }, [onPaste]);

  return (
    <IconButton size="small" onClick={handlePaste}>
      <CallReceived />
    </IconButton>
  );
}
