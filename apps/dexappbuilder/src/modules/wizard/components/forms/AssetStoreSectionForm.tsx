import {
  AppPageSection,
  AssetStorePageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import AssetStoreForm from './AssetStoreForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: AssetStorePageSection;
}
export function AssetStoreSectionForm({
  onSave,
  onChange,
  onCancel,
  section,
}: Props) {
  const [data, setData] = useState(section?.config);
  useEffect(() => {
    onChange({
      type: 'asset-store',
      title: data?.title,
      config: data,
    });
  }, [data]);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
    <AssetStoreForm
      item={data}
      onChange={(d) => setData(d)}
      onSubmit={(val) => {
        onSave({
          type: 'asset-store',
          title: val.title,
          config: val,
        });
      }}
      onCancel={onCancel}
    />
      </Box>
    </Container>
  );
}
