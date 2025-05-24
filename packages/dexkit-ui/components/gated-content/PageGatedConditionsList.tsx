import { Grid } from '@mui/material';

import { GatedCondition } from '@dexkit/ui/modules/wizard/types';

import { useCallback } from 'react';
import PageGatedConditionsListItem from './PageGatedConditionsListItem';

export interface PageGatedConditionsListProps {
  conditions: GatedCondition[];
  onAction: (index: number, action: string) => void;
  onChange: (conditions: GatedCondition[]) => void;
}

export default function PageGatedConditionsList({
  conditions,
  onAction,
  onChange,
}: PageGatedConditionsListProps) {
  const handleAction = (index: number, action: string) => {
    return () => {
      onAction(index, action);
    };
  };

  const handleChange = useCallback(
    (condition: GatedCondition, index: number) => {
      const newConditions = structuredClone([...conditions]);

      newConditions[index] = { ...condition };

      onChange(newConditions);
    },
    [conditions],
  );

  return (
    <Grid container spacing={2}>
      {conditions.map((cond, index) => (
        <Grid item xs={12} key={index}>
          <PageGatedConditionsListItem
            condition={cond}
            index={index}
            onRemove={handleAction(index, 'remove')}
            onEdit={handleAction(index, 'edit')}
            onChange={handleChange}
          />
        </Grid>
      ))}
    </Grid>
  );
}
