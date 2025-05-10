import { Container, Dialog, DialogProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import PageEditor from '../PageEditor';

interface Props {
  dialogProps: DialogProps;
  value?: string;
  title?: string;
  readonly?: boolean;
}

export default function PageEditorDialog({
  dialogProps,
  title,
  value,
  readonly,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="page.preview.title"
            defaultMessage="{title} page preview"
            values={{ title }}
          />
        }
        onClose={handleClose}
      />
      <Container maxWidth={'xl'}>
        <PageEditor value={value} readOnly={readonly} />
      </Container>
    </Dialog>
  );
}
