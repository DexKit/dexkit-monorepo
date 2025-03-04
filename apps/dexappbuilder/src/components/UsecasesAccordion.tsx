import { UseCases } from '@/modules/wizard/constants/whitelabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { List, ListItem, ListItemText, Stack } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';

interface Props {
  onFilterUsecase?: (usecase: string) => void;
  selectedUsecases?: string[];
  defaultExpanded?: boolean;
}

export function UsecasesAccordion({
  onFilterUsecase,
  selectedUsecases,
  defaultExpanded,
}: Props) {
  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="usecases"
          id="usecases-display"
        >
          <Typography>
            <FormattedMessage id={'usecases'} defaultMessage={'Use cases'} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {Object.values(UseCases).map((use, key) => (
              <ListItem
                key={key}
                secondaryAction={
                  <FormControlLabel
                    value="start"
                    control={
                      <Checkbox checked={selectedUsecases?.includes(use)} />
                    }
                    onClick={() => {
                      if (onFilterUsecase) {
                        onFilterUsecase(use);
                      }
                    }}
                    label={''}
                  />
                }
              >
                <ListItemText primary={use} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
