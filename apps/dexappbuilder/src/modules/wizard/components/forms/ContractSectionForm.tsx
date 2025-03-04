import {
  AppPageSection,
  ContractPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { Grid } from '@mui/material';
import { ContractFormParams } from '@dexkit/web3forms/types';
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
  );
}
