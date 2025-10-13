import Search from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

import dynamic from "next/dynamic";
import { FormattedMessage, useIntl } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import LazyTextField from "../LazyTextField";

const SelectIconGrid = dynamic(() => import("../SelectIconGrid"), {
  ssr: false,
});

export interface SelectIconDialogProps {
  DialogProps: DialogProps;
  onConfirm: (iconName: string) => void;
}

export default function SelectIconDialog({
  DialogProps,
  onConfirm,
}: SelectIconDialogProps) {
  const { onClose } = DialogProps;
  const [selectedIcon, setSelectedIcon] = useState<string>();
  const [filters, setFilters] = useState({
    query: "",
    theme: "material-icons",
  });

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleSelect = (iconName: string) => {
    if (iconName === selectedIcon) {
      setSelectedIcon(undefined);
    } else {
      setSelectedIcon(iconName);
    }
  };

  const handleChangeTheme = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters: any) => ({ ...filters, theme: e.target.value }));
  };

  const { formatMessage } = useIntl();

  const handleConfirm = () => {
    if (selectedIcon) {
      onConfirm(selectedIcon);
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.icon" defaultMessage="Select icon" />
        }
        onClose={handleClose}
      />
      <DialogContent sx={{ p: 0 }} dividers>
        <Box sx={{ p: 2 }}>
          <LazyTextField
            onChange={(value) =>
              setFilters((filters: any) => ({ ...filters, query: value }))
            }
            value={filters.query}
            TextFieldProps={{
              fullWidth: true,
              placeholder: formatMessage({
                id: "search.for.an.icon",
                defaultMessage: "Search for an icon",
              }),
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Divider />
        <Grid container>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box p={2}>
              <FormControl>
                <FormLabel id="theme">
                  <FormattedMessage
                    id="icon.theme"
                    defaultMessage="Icon theme"
                  />
                </FormLabel>
                <RadioGroup
                  onChange={handleChangeTheme}
                  aria-labelledby="theme"
                  defaultValue="Outlined"
                  value={filters.theme}
                >
                  <FormControlLabel
                    value="material-icons"
                    control={<Radio />}
                    label="Outlined"
                  />
                  <FormControlLabel
                    value="material-icons-two-tone"
                    control={<Radio />}
                    label="TwoTone"
                  />
                  <FormControlLabel
                    value="material-icons-sharp"
                    control={<Radio />}
                    label="Sharp"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid size="grow">
            <SelectIconGrid
              onSelect={handleSelect}
              value={selectedIcon}
              filters={filters}
              key={filters.theme}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!selectedIcon}
          onClick={handleConfirm}
          variant="contained"
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
