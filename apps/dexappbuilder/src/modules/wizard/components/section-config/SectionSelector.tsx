import { SectionType } from '@dexkit/ui/modules/wizard/types/section';
import SearchIcon from '@mui/icons-material/Search';
import { Box, ButtonBase, Stack, Tooltip, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SECTION_TYPES_DATA, SectionCategory } from './Sections';

interface Props {
  onClickSection: ({ sectionType }: { sectionType: SectionType }) => void;
}

export function SectionSelector({ onClickSection }: Props) {
  const [value, setValue] = useState<string>('all');
  const [search, setSearch] = useState<string>();
  const { formatMessage } = useIntl();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ pl: 3, pr: 3 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} justifyContent={'center'}>
          <Box sx={{ pl: 2, pr: 2 }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-search">
                <FormattedMessage id={'search'} defaultMessage={'Search'} />
              </InputLabel>
              <OutlinedInput
                id="outlined-search"
                onChange={(s) => setSearch(s.currentTarget.value)}
                label={
                  <FormattedMessage id={'search'} defaultMessage={'Search'} />
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="search" edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab
              label={<FormattedMessage id={'all'} defaultMessage={'All'} />}
              value={'all'}
            />
            {SectionCategory.map((cat, key) => (
              <Tab
                key={key}
                label={
                  <FormattedMessage id={cat.value} defaultMessage={cat.title} />
                }
                value={cat.value}
              />
            ))}
          </Tabs>
        </Grid>

        {/*  <Box
              sx={{
                border: '1px solid',
                width: '121px',
                height: '112px',
                borderRadius: '8px',
              }}
              component="button"
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
              display={'flex'}
              flexDirection={'column'}
            >
              <SearchIcon />

              <Typography variant="subtitle2">
                {' '}
                <FormattedMessage id={'search'} defaultMessage={'Search'} />
              </Typography>
            </Box>*/}
        {/* <Button
              sx={{
                border: '1px solid',
                width: '121px',
                height: '112px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                spacing={1}
              >
                <SearchIcon />

                <Typography variant="body2">
                  {' '}
                  <FormattedMessage id={'search'} defaultMessage={'Search'} />
                </Typography>
              </Stack>
            </Button>*/}
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ overflow: 'auto' }}>
            {SectionCategory.filter((c) => {
              if (value !== 'all') {
                return c.value === value;
              }
              return true;
            }).map((cat, key) => (
              <React.Fragment key={key}>
                <Grid item xs={12}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    {cat.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} flexWrap="wrap">
                    {SECTION_TYPES_DATA.filter((s) => s.category === cat.value)
                      .filter((s) => {
                        if (search) {
                          return (
                            formatMessage({
                              id: s.titleId,
                              defaultMessage: s.titleDefaultMessage,
                            })
                              .toLowerCase()
                              .indexOf(search.toLowerCase()) !== -1
                          );
                        } else {
                          return true;
                        }
                      })
                      .map((sec, k) => (
                        <Grid item xs={6} lg={4} xl={3} key={k}>
                          <Tooltip title={sec.description}>
                            <ButtonBase
                              sx={{
                                display: 'block',
                                width: '100%',
                                px: { sm: 4, xs: 1 },
                                height: (theme) => theme.spacing(16),
                                border: '1px solid',
                                borderRadius: (theme) =>
                                  theme.shape.borderRadius / 2,
                                borderColor: 'text.secondary',
                              }}
                              onClick={() => {
                                onClickSection({ sectionType: sec.type });
                              }}
                            >
                              <Stack
                                justifyContent={'center'}
                                alignItems={'center'}
                                spacing={1}
                              >
                                {sec.icon}
                                <Typography
                                  sx={{
                                    typography: { sm: 'body2', xs: 'caption' },
                                  }}
                                >
                                  {' '}
                                  {formatMessage({
                                    id: sec.titleId,
                                    defaultMessage: sec.titleDefaultMessage,
                                  }) || ''}
                                </Typography>
                              </Stack>
                            </ButtonBase>
                          </Tooltip>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
