import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Box,
  Button,
  Card,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  useTheme,
} from '@mui/material';

import {
  AppPageSection,
  SectionType,
} from '@dexkit/ui/modules/wizard/types/section';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';

import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { useIsMobile } from '@dexkit/ui/hooks/misc';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Add from '@mui/icons-material/AddOutlined';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Search from '@mui/icons-material/SearchOutlined';
import { useMemo, useState } from 'react';
import { SECTION_CONFIG } from '../../constants/sections';
import { PageSectionKey } from '../../hooks/sections';
import PageSection from './PageSection';
import PageSectionsHeader from './PageSectionsHeader';
import SectionTypeAutocomplete from './SectionTypeAutocomplete';
import SectionsPagination from './SectionsPagination';
import VisibilityAutocomplete from './VisibilityAutocomplete';

function getSectionType(
  section: AppPageSection,
  formatMessage: (
    descriptor: MessageDescriptor,
    values?: Record<string, any>,
  ) => string,
) {
  const config = SECTION_CONFIG[section.type];
  if (config) {
    return {
      subtitle: config.title,
      title:
        !section.name && !section.title
          ? formatMessage({
              id: 'unnamed.section',
              defaultMessage: 'Unnamed Section',
            })
          : section.name
            ? section.name
            : section.title || '',
      icon: config.icon,
    };
  }
  return null;
}

export interface PageSectionsProps {
  page: AppPage;
  onSwap: (index: number, other: number) => void;
  onAction: (action: string, index: number) => void;
  onClose: () => void;
  onClone: () => void;
  onEmbed?: () => void;
  onEditTitle: (page: string, title: string) => void;
  onEditLayout: () => void;
  onAdd: () => void;
  onPreview: () => void;
  activeSection?: PageSectionKey;
  onAddSection: () => void;
  onAddCustomSection: () => void;
  onChangeName: (index: number, name: string) => void;
  pageKey?: string;
  siteId?: string;
  hideEmbedMenu?: boolean;
}

export default function PageSections({
  page,
  pageKey,
  siteId,
  onSwap,
  onAction,
  onClose,
  onAdd,
  onEmbed,
  onChangeName,
  onEditTitle,
  onEditLayout,
  onClone,
  activeSection,
  onAddSection,
  onAddCustomSection,
  onPreview,
  hideEmbedMenu,
}: PageSectionsProps) {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [hideDesktop, setHideDesktop] = useState(false);
  const [hideMobile, setHideMobile] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [sectionType, setSectionType] = useState<SectionType>(
    '' as SectionType,
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const index = parseInt(event.active.data.current?.index);
      const otherIndex = parseInt(event.over.data.current?.index);

      if (otherIndex === 0 && event.over.data.current?.position === 'bottom') {
        return onSwap(index, otherIndex + 1);
      }

      if (index === 0 && otherIndex === 0) {
        return;
      }

      if (index === 0) {
        return onSwap(index, otherIndex);
      }

      onSwap(index, otherIndex);
    }
  };

  const handleAction = (index: number) => {
    return (action: string) => {
      onAction(action, index);
    };
  };

  const handleChangeName = (index: number) => {
    return (name: string) => {
      onChangeName(index, name);
    };
  };

  const [query, setQuery] = useState('');

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  const filteredSections = useMemo(() => {
    return (
      page?.sections
        ?.map((p, index) => {
          return { ...p, index };
        })
        ?.filter((s) => {
          const hasTitle =
            s &&
            s.title &&
            s.title.toLowerCase()?.search(query.toLowerCase()) > -1;
          const hasName =
            s &&
            s.name &&
            s.name.toLowerCase()?.search(query.toLowerCase()) > -1;
          const hasType =
            s && s.type.toLowerCase()?.search(query.toLowerCase()) > -1;

          const filter = hasTitle || hasType || hasName || query === '';

          if ((sectionType as string) !== '') {
            return filter && sectionType === s.type;
          }

          return filter;
        }) || []
    );
  }, [page, JSON.stringify(page), query, hideDesktop, hideMobile, sectionType]);

  const { formatMessage } = useIntl();

  const [currPage, setCurrPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [offset, limit] = useMemo(() => {
    return [currPage * pageSize, currPage * pageSize + pageSize];
  }, [
    JSON.stringify(filteredSections),
    currPage,
    pageSize,
    JSON.stringify(page),
  ]);

  const pageList = useMemo(() => {
    return filteredSections?.slice(offset, limit) || [];
  }, [JSON.stringify(filteredSections), offset, limit, JSON.stringify(page)]);

  const renderSections = () => {
    return pageList?.map((section: any, index: any) => {
      if (hideDesktop && hideMobile) {
        if (section.hideDesktop && section.hideMobile) {
          return null;
        }
      } else if (hideDesktop && !hideMobile) {
        if (section.hideDesktop) {
          return null;
        }
      } else if (!hideDesktop && hideMobile) {
        if (section.hideMobile) {
          return null;
        }
      }

      return (
        <Grid
          key={`${JSON.stringify(section)}-${section.index}`}
          sx={{ mb: isMobile ? theme.spacing(0.5) : theme.spacing(1) }}
          size={12}>
          <PageSection
            showTopDroppable={section.index === 0}
            index={section.index}
            siteId={siteId}
            page={pageKey}
            expand={!isMobile}
            hideEmbedMenu={hideEmbedMenu}
            icon={getSectionType(section, formatMessage)?.icon}
            title={getSectionType(section, formatMessage)?.title}
            subtitle={
              getSectionType(section, formatMessage)?.subtitle ? (
                <FormattedMessage
                  id={getSectionType(section, formatMessage)?.subtitle?.id}
                  defaultMessage={
                    getSectionType(section, formatMessage)?.subtitle
                      ?.defaultMessage
                  }
                />
              ) : (
                ''
              )
            }
            id={section.index.toString()}
            onAction={handleAction(section.index)}
            section={section}
            onChangeName={handleChangeName(section.index)}
            active={
              pageKey !== undefined &&
              activeSection !== undefined &&
              activeSection?.index === section.index &&
              pageKey === activeSection.page
            }
            layout={page.layout}
          />
        </Grid>
      );
    });
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      autoScroll={{
        threshold: {
          x: 0,
          y: 0.1,
        },
      }}
    >
      <Stack spacing={0} sx={{ width: '100%' }}>
        <PageSectionsHeader
          onClose={onClose}
          onClone={onClone}
          onEmbed={onEmbed}
          onEditTitle={(title) => onEditTitle(pageKey || '', title)}
          onEditLayout={onEditLayout}
          onPreview={onPreview}
          page={page}
          pageKey={pageKey}
        />
        <Box
          sx={{
            width: '100%',
            px: 0,
            ml: 0,
          }}
        >
          <Stack spacing={theme.spacing(0.5)} sx={{ width: '100%' }}>
            <Stack
              spacing={theme.spacing(0.5)}
              direction={isMobile ? 'column' : 'row'}
              sx={{ width: '100%' }}
            >
              <Grid
                container
                spacing={theme.spacing(0.5)}
                sx={{
                  width: '100%',
                  px: isMobile ? 0 : 0,
                  pb: isMobile ? 0 : theme.spacing(2),
                }}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: isMobile ? 12 : 6
                  }}>
                  <Stack
                    spacing={theme.spacing(0.5)}
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      width: '100%',
                      ml: 0,
                    }}
                  >
                    <Button
                      size={isMobile ? 'small' : 'medium'}
                      startIcon={
                        <Add fontSize={isMobile ? 'small' : 'medium'} />
                      }
                      onClick={onAddSection}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        maxWidth: 'calc(50% - 4px)',
                        px: isMobile ? 1.5 : 1,
                        pb: isMobile ? undefined : 1.5,
                        pt: isMobile ? undefined : 1.5,
                        '& .MuiButton-startIcon': {
                          marginRight: isMobile ? 0.25 : 0.5,
                          '& > *:nth-of-type(1)': {
                            fontSize: isMobile ? 16 : 20,
                          },
                        },
                        '& .MuiButton-label': {
                          whiteSpace: 'nowrap',
                        },
                      }}
                    >
                      {isMobile ? (
                        <FormattedMessage
                          id="add.section.short"
                          defaultMessage="Section"
                        />
                      ) : (
                        <FormattedMessage
                          id="add.section"
                          defaultMessage="Add section"
                        />
                      )}
                    </Button>
                    <Button
                      size={isMobile ? 'small' : 'medium'}
                      startIcon={
                        <Add fontSize={isMobile ? 'small' : 'medium'} />
                      }
                      onClick={onAddCustomSection}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        maxWidth: 'calc(50% - 4px)',
                        px: isMobile ? 1.5 : 1,
                        pb: isMobile ? undefined : 1.5,
                        pt: isMobile ? undefined : 1.5,
                        '& .MuiButton-startIcon': {
                          marginRight: isMobile ? 0.25 : 0.5,
                          '& > *:nth-of-type(1)': {
                            fontSize: isMobile ? 16 : 20,
                          },
                        },
                        '& .MuiButton-label': {
                          whiteSpace: 'nowrap',
                        },
                      }}
                    >
                      {isMobile ? (
                        <FormattedMessage
                          id="add.custom.short"
                          defaultMessage="Custom"
                        />
                      ) : (
                        <FormattedMessage
                          id="add.custom.section"
                          defaultMessage="Add custom section"
                        />
                      )}
                    </Button>
                  </Stack>
                </Grid>
                <Grid
                  sx={{ mt: isMobile ? theme.spacing(0.5) : 0 }}
                  size={{
                    xs: 12,
                    sm: isMobile ? 12 : 6
                  }}>
                  <Stack
                    spacing={0.25}
                    direction="row"
                    sx={{ width: '100%', ml: isMobile ? 0 : 0 }}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Box sx={{ width: 'auto' }}>
                      <LazyTextField
                        value={query}
                        onChange={handleChangeQuery}
                        TextFieldProps={{
                          size: isMobile ? 'small' : 'medium',
                          variant: 'standard',
                          sx: {
                            width: '100%',
                            maxWidth: isMobile ? '130px' : '200px',
                            pb: isMobile ? undefined : 1,
                            '& .MuiInputBase-root': {
                              fontSize: isMobile ? '0.875rem' : 'inherit',
                              height: isMobile ? undefined : '40px',
                              alignItems: 'center',
                            },
                          },
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search
                                  fontSize={isMobile ? 'small' : 'medium'}
                                />
                              </InputAdornment>
                            ),
                          },
                          placeholder: formatMessage({
                            id: 'search.dots',
                            defaultMessage: 'Search...',
                          }),
                        }}
                      />
                    </Box>
                    <IconButton
                      onClick={() => setShowFilters(!showFilters)}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ p: 0.25, mb: isMobile ? undefined : 1 }}
                    >
                      {showFilters ? <FilterAltOffIcon /> : <FilterAltIcon />}
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>

            {isMobile && <Box sx={{ height: 20 }} />}

            {showFilters && (
              <Collapse in={showFilters} sx={{ width: '100%' }}>
                <Card>
                  <Box p={2}>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Grid
                        size={{
                          xs: 12,
                          sm: 4
                        }}>
                        <FormControl fullWidth>
                          <InputLabel shrink>
                            <FormattedMessage
                              id="section.type"
                              defaultMessage="Section Type"
                            />
                          </InputLabel>
                          <SectionTypeAutocomplete
                            sectionType={sectionType}
                            setSectionType={setSectionType}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 4
                        }}>
                        <VisibilityAutocomplete
                          onChange={(desktop, mobile) => {
                            setHideDesktop(desktop);
                            setHideMobile(mobile);
                          }}
                          desktop={hideDesktop}
                          mobile={hideMobile}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Collapse>
            )}

            <Box sx={{ width: '100%', mt: isMobile ? 8 : 1 }}>
              <Grid
                container
                spacing={0}
                sx={{ width: '100%', px: 0, ml: isMobile ? 0 : 0 }}
              >
                {renderSections()}
                <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} size={12}>
                  <SectionsPagination
                    pageSize={pageSize}
                    from={offset}
                    to={limit}
                    onChange={(pageSize) => {
                      setCurrPage(0);
                      setPageSize(pageSize);
                    }}
                    onChangePage={(page: number) => setCurrPage(page)}
                    count={filteredSections.length}
                    pageCount={pageList.length}
                    page={currPage}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </DndContext>
  );
}
