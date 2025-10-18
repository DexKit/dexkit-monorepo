import {
  AppPageSection,
  ContractPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { ContractFormParams } from '@dexkit/web3forms/types';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', px: isMobile ? 2 : 0 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
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
