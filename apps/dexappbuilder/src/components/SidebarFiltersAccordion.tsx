import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  title: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
  expanded?: boolean;
}

export default function SidebarFiltersAccordion({
  title,
  children,
  expanded,
}: Props) {
  const theme = useTheme();

  return (
    <Accordion
      sx={{ borderRightWidth: 0, borderLeftWidth: 0, borderBottomWidth: 0 }}
      square
      disableGutters
      defaultExpanded={expanded}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontWeight: theme.typography.fontWeightMedium
          }}
          variant="body1"
        >
          {title}
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
