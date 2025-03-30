import { useCallback } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { KittygotchiTraitType } from '../constants/index';

import { KittygotchiTraitItem } from '../types/index';
import TraitSelectorItem from './TraitSelectorItem';

interface Props {
  title: string;
  items: KittygotchiTraitItem[];
  onSelect: (item: KittygotchiTraitItem) => void;
  value?: string;
  kitHolding: number;
  traitType: KittygotchiTraitType;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

export const KittygotchiTraitSelector = (props: Props) => {
  const {
    title,
    items,
    onSelect,
    value,
    kitHolding,
    traitType,
    defaultExpanded,
    disabled,
  } = props;

  const handleSelect = useCallback(
    (item: KittygotchiTraitItem) => {
      onSelect(item);
    },
    [onSelect]
  );

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1">{title}</Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              overflowY: 'hidden',
              overflowX: 'scroll',
              flexWrap: 'nowrap',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            },
            [theme.breakpoints.up('sm')]: {
              overflowX: 'scroll',
            },
          })}
          p={4}
        >
          <Grid
            container
            spacing={4}
            alignItems="center"
            alignContent="center"
            wrap="nowrap"
          >
            {items.map((item: KittygotchiTraitItem, index: number) => (
              <Grid item key={index}>
                <TraitSelectorItem
                  item={item}
                  traitType={traitType}
                  locked={kitHolding < item.holding}
                  selected={(value || '') === item.value}
                  onClick={handleSelect}
                  disabled={disabled}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default KittygotchiTraitSelector;
