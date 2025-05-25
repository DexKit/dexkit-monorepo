import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box, Paper, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import PreviewPagePlatform from '../PreviewPagePlatform';

interface Props {
  sections: AppPageSection[];
  name: string;
  hideButtons?: boolean;
}

export function PagePreviewPaper({ sections, name, hideButtons }: Props) {
  return (
    <Paper>
      <Box>
        <PreviewPagePlatform
          sections={sections}
          disabled={true}
          enableOverflow={true}
          title={
            <Typography variant="body1">
              <FormattedMessage
                id="page.preview.title"
                defaultMessage="{name} page preview"
                values={{ name }}
              />
            </Typography>
          }
        />
      </Box>
    </Paper>
  );
}
