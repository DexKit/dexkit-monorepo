import {
  AppPageSection,
  ContractPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { ContractFormParams } from '@dexkit/web3forms/types';
import { Box, Container, Grid } from '@mui/material';
import { useEffect } from 'react';
import ContractForm from './ContractForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: ContractPageSection;
}
export function ContractSectionForm({
  onSave,
  onChange,
  onCancel,
  section,
}: Props) {
  const handleSaveData = (data: ContractFormParams | undefined) => {
    onSave({
      type: 'contract',
      config: data,
    });
  };

  const handleChangeData = (data: ContractFormParams | undefined) => {
    onChange({
      type: 'contract',
      config: data,
    });
  };

  useEffect(() => {
    onChange({
      type: 'contract',
      config: section?.config,
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ContractForm
              params={section?.config}
              onCancel={onCancel}
              onSave={handleSaveData}
              onChange={handleChangeData}
              updateOnChange={true}
              showSaveButton
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
