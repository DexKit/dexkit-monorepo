import Card from '@dexkit/dexappbuilder-viewer/components/Card';
import { CardPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box } from '@mui/material';

interface Props {
  section: CardPageSection;
}

export default function CardSection({ section }: Props) {
  if (!section?.settings) {
    return null;
  }

  const { title, description, image, actions, sx } = section.settings;

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 2 }}>
      <Card
        title={title}
        description={description}
        image={image}
        actions={actions}
        sx={sx}
      />
    </Box>
  );
}
