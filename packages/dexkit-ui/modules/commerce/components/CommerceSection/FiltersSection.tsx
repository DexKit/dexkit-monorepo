import {
  Box,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { CategoryType } from "../../types";

export interface FiltersSectionProps {
  onChange: (filters: any) => void;
  filters: any;
  categories: CategoryType[];
  onClear: () => void;
}

export default function FiltersSection({
  categories,
  onChange,
  filters,
  onClear,
}: FiltersSectionProps) {
  const handleSelectCategory = (id: string) => {
    return () => {
      if (filters.categories.includes(id)) {
        return onChange({ ...filters, categories: [] });
      }

      onChange({ ...filters, categories: [id] });
    };
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Typography sx={{ px: 2 }} variant="subtitle1" fontWeight="bold">
        <FormattedMessage id="categories" defaultMessage="Categories" />
      </Typography>
      <List disablePadding>
        {categories.map((category, index) => (
          <ListItem key={index}>
            <ListItemText primary={category.name} />
            <ListItemSecondaryAction>
              <Radio
                onClick={handleSelectCategory(category?.id ?? "")}
                checked={filters.categories.includes(category.id ?? "")}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button onClick={onClear} fullWidth>
        <FormattedMessage id="clear" defaultMessage="Clear" />
      </Button>
    </Box>
  );
}
