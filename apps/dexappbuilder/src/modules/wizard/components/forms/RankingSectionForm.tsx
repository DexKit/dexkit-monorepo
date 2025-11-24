import LazyTextField from '@dexkit/ui/components/LazyTextField';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

import { useEditSiteId } from '@dexkit/ui/hooks';
import { RankingPageSection } from '@dexkit/ui/modules/wizard/types/section';
import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Link from '@dexkit/ui/components/AppLink';
import { useAppRankingListQuery } from '@dexkit/ui/modules/wizard/hooks/ranking';
import RankingFormCard from '../RankingFormCard';
interface Props {
  onSave: (section: RankingPageSection) => void;
  onChange: (section: RankingPageSection) => void;
  section?: RankingPageSection;
  onCancel: () => void;
  hideFormInfo?: boolean;
  saveOnChange?: boolean;
  showSaveButton?: boolean;
}

export function RankingSectionForm({
  onSave,
  onChange,
  onCancel,
  section,
  saveOnChange,
  showSaveButton,
}: Props) {
  const { editSiteId } = useEditSiteId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
  });

  const listRankingQuery = useAppRankingListQuery({
    ...paginationModel,
    ...queryOptions,
    siteId: editSiteId,
  });

  const [selectedRanking, setSelectedRanking] = useState<{
    id: number;
    title?: string;
  }>();

  const [paddingConfig, setPaddingConfig] = useState<{
    desktop?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    mobile?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  }>(section?.settings?.paddingConfig || {});

  const handleChange = (value: string) => {
    let filter = queryOptions.filter;
    if (value) {
      filter.q = value;
    } else {
      filter.q = undefined;
    }
    setQueryOptions({ ...queryOptions, filter });
  };

  const handleClick = useCallback(
    (id: number, title?: string) => {
      setSelectedRanking({ title: title, id: id });

      if (saveOnChange && id) {
        onChange({
          ...section,
          type: 'ranking',
          title: title,
          settings: { 
            rankingId: id,
            paddingConfig: paddingConfig,
          },
        });
      }
    },
    [saveOnChange, paddingConfig, section],
  );

  const handleSave = useCallback(() => {
    if (selectedRanking?.id) {
      onSave({
        ...section,
        type: 'ranking',
        title: selectedRanking.title,
        settings: { 
          rankingId: selectedRanking.id,
          paddingConfig: paddingConfig,
        },
      });
    }
  }, [onSave, selectedRanking, paddingConfig, section]);

  const handlePaddingChange = (
    device: 'desktop' | 'mobile',
    side: 'top' | 'bottom' | 'left' | 'right',
    value: number | number[]
  ) => {
    const numValue = Array.isArray(value) ? value[0] : value;
    const newPaddingConfig = {
      ...paddingConfig,
      [device]: {
        ...paddingConfig[device],
        [side]: numValue,
      },
    };
    
    setPaddingConfig(newPaddingConfig);

    if (saveOnChange && selectedRanking?.id) {
      onChange({
        ...section,
        type: 'ranking',
        title: selectedRanking.title,
        settings: {
          rankingId: selectedRanking.id,
          paddingConfig: newPaddingConfig,
        },
      });
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPaginationModel({ ...paginationModel, page: value });
  };

  useEffect(() => {
    if (!selectedRanking && section?.settings.rankingId) {
      setSelectedRanking({
        id: section.settings.rankingId,
        title: section.title,
      });
    }
    if (section?.settings?.paddingConfig) {
      setPaddingConfig(section.settings.paddingConfig);
    }
  }, [section]);

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
            {listRankingQuery.data?.data.map((ranking) => (
              <Grid key={ranking.id} size={12}>
                <RankingFormCard
                  id={ranking.id}
                  description={ranking?.description}
                  title={ranking?.title}
                  selected={selectedRanking?.id === ranking.id}
                  onClick={handleClick}
                />
              </Grid>
            ))}
            {listRankingQuery.data &&
              listRankingQuery.data?.data.length === 0 && (
                <Grid size={12}>
                  <Pagination
                    count={
                      (listRankingQuery.data.total || 0) /
                      paginationModel.pageSize
                    }
                    page={paginationModel.page}
                    onChange={handlePageChange}
                  />
                </Grid>
              )}

            {listRankingQuery.isLoading &&
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
            {listRankingQuery.data &&
              listRankingQuery.data?.data.length === 0 && (
                <Grid size={12}>
                  <Box py={2}>
                    <Stack spacing={2} alignItems="center">
                      <TipsAndUpdatesIcon fontSize="large" />
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="you.dont.have.any.leaderboards"
                            defaultMessage="You don't have any leaderboards yet"
                          />
                        </Typography>
                        <Typography align="center" variant="body1">
                          <FormattedMessage
                            id="please.create.a.leaderboard.to.start.using.it.here"
                            defaultMessage="Please, create a leaderboard to start using it here"
                          />
                        </Typography>
                      </Box>
                      {false && (
                        <Button
                          LinkComponent={Link}
                          href="/forms/create"
                          variant="contained"
                          color="primary"
                          target="_blank"
                          startIcon={<AddIcon />}
                        >
                          <FormattedMessage
                            id="create.form"
                            defaultMessage="Create form"
                          />
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              )}
          </Grid>
        </Grid>

        {selectedRanking && (
          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              <FormattedMessage
                id="padding.configuration"
                defaultMessage="Padding Configuration"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <FormattedMessage
                id="padding.configuration.description"
                defaultMessage="Configure the padding for desktop and mobile devices separately"
              />
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <FormattedMessage
                    id="desktop.padding"
                    defaultMessage="Desktop Padding"
                  />
                </Typography>
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.top"
                    defaultMessage="Top"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.desktop?.top ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('desktop', 'top', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.bottom"
                    defaultMessage="Bottom"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.desktop?.bottom ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('desktop', 'bottom', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.left"
                    defaultMessage="Left"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.desktop?.left ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('desktop', 'left', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.right"
                    defaultMessage="Right"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.desktop?.right ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('desktop', 'right', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid size={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <FormattedMessage
                    id="mobile.padding"
                    defaultMessage="Mobile Padding"
                  />
                </Typography>
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.top"
                    defaultMessage="Top"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.mobile?.top ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('mobile', 'top', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.bottom"
                    defaultMessage="Bottom"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.mobile?.bottom ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('mobile', 'bottom', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.left"
                    defaultMessage="Left"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.mobile?.left ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('mobile', 'left', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={12} sx={{ px: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="padding.right"
                    defaultMessage="Right"
                  />
                </Typography>
                <Slider
                  value={paddingConfig.mobile?.right ?? 0}
                  onChange={(_, value) =>
                    handlePaddingChange('mobile', 'right', value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Grid>
        )}

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
                  disabled={selectedRanking === undefined}
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
