import LazyTextField from '@dexkit/ui/components/LazyTextField';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Link from '@dexkit/ui/components/AppLink';
import WidgetFormCard from '../WidgetFormCard';

import { useWidgetsByOwnerQuery } from '@dexkit/ui/modules/wizard/hooks/widget';
import {
  AppPageSection,
  WidgetPageSection,
} from '@dexkit/ui/modules/wizard/types/section';

interface Props {
  section?: WidgetPageSection;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  editWidgetId?: number;
  saveOnChange?: boolean;
  showSaveButton?: boolean;
}

export function WidgetForm({
  onSave,
  onChange,
  onCancel,
  editWidgetId,
  section,
  saveOnChange,
  showSaveButton,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [query, setQuery] = useState<string>();

  const listWidgetsQuery = useWidgetsByOwnerQuery();

  const [selectedWidgetId, setSelectedWigetId] = useState<number>(
    section?.config?.widgetId as number,
  );

  const handleChange = (value: string) => {
    setQuery(value);
  };
  const widgetsData = listWidgetsQuery.data;

  const filteredData = useMemo(() => {
    if (widgetsData && widgetsData.length > 0) {
      let filteredWidgets = widgetsData;

      if (editWidgetId) {
        filteredWidgets = widgetsData.filter((w) => w.id !== editWidgetId);
      }

      if (query) {
        return filteredWidgets.filter(
          (c) =>
            c.configParsed.name.toLowerCase().search(query.toLowerCase()) > -1,
        );
      }

      return filteredWidgets;
    }

    return [];
  }, [widgetsData, query, editWidgetId]);

  const handleClick = useCallback(
    (id: number) => {
      setSelectedWigetId(id);

      if (saveOnChange && id) {
        onChange({
          ...section,
          type: 'widget',
          config: {
            widgetId: id,
          },
        });
      }
    },
    [saveOnChange],
  );

  const handleSave = useCallback(() => {
    if (selectedWidgetId) {
      onSave({
        ...section,
        type: 'widget',
        config: {
          widgetId: selectedWidgetId,
        },
      });
    }
  }, [onSave, selectedWidgetId]);

  return (
    <Box sx={{ px: isMobile ? 2 : 0 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <LazyTextField
            TextFieldProps={{
              size: 'small',
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            {filteredData?.map((widget: any) => (
              <Grid key={widget.id} size={12}>
                <WidgetFormCard
                  id={widget.id}
                  name={widget.configParsed.name}
                  selected={selectedWidgetId === widget.id}
                  onClick={handleClick}
                />
              </Grid>
            ))}
            {listWidgetsQuery.isLoading &&
              new Array(5).fill(null).map((_, index) => (
                <Grid key={index} size={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">
                        <Skeleton />
                      </Typography>
                      <Typography variant="body1">
                        <Skeleton />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            {listWidgetsQuery.data && listWidgetsQuery.data?.length === 0 && (
              <Grid size={12}>
                <Box py={2}>
                  <Stack spacing={2} alignItems="center">
                    <TipsAndUpdatesIcon fontSize="large" />
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="you.dont.have.any.widgets"
                          defaultMessage="You don't have any widget yet"
                        />
                      </Typography>
                      <Typography align="center" variant="body1">
                        <FormattedMessage
                          id="please.create.a.widgets.to.start.using.it.here"
                          defaultMessage="Please, create widgets to start using it here"
                        />
                      </Typography>
                    </Box>
                    <Button
                      LinkComponent={Link}
                      href="/admin/widget"
                      variant="contained"
                      color="primary"
                      target="_blank"
                      startIcon={<AddIcon />}
                    >
                      <FormattedMessage
                        id="create.widget"
                        defaultMessage="Create widget"
                      />
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>

        {showSaveButton && (
          <Grid size={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={2}
              >
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedWidgetId === undefined}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
