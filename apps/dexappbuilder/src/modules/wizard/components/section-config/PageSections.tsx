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
  Typography,
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
}

export default function PageSections({
  page,
  pageKey,
  siteId,
  onSwap,
  onAction,
  onClose,
  onAdd,
  onChangeName,
  onEditTitle,
  onEditLayout,
  onClone,
  activeSection,
  onAddSection,
  onAddCustomSection,
  onPreview,
}: PageSectionsProps) {
  const isMobile = useIsMobile();

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
    return pageList?.map((section, index) => {
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
        <Grid item xs={12} key={`${JSON.stringify(section)}-${section.index}`}>
          <PageSection
            showTopDroppable={section.index === 0}
            index={section.index}
            siteId={siteId}
            page={pageKey}
            expand={!isMobile}
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
    <Box>
      <Stack spacing={2}>
        <PageSectionsHeader
          onClose={onClose}
          onPreview={onPreview}
          onClone={onClone}
          onEditTitle={(title) => {
            if (pageKey) {
              onEditTitle(pageKey, title);
            }
          }}
          page={page}
          onEditLayout={onEditLayout}
        />

        <Box py={2}>
          <Stack spacing={2} direction="row">
            <Box maxWidth={'xs'}>
              <Button
                variant="outlined"
                onClick={onAddSection}
                startIcon={<Add />}
              >
                <FormattedMessage
                  id="add.section"
                  defaultMessage="Add section"
                />
              </Button>
            </Box>

            <Box maxWidth={'xs'}>
              <Button
                variant="outlined"
                onClick={onAddCustomSection}
                startIcon={<Add />}
              >
                <FormattedMessage
                  id="add.custom.section"
                  defaultMessage="Add custom section"
                />
              </Button>
            </Box>
          </Stack>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight="500" variant="h6">
              <FormattedMessage
                id="page.sections"
                defaultMessage="Page sections"
              />
            </Typography>
            <IconButton onClick={() => setShowFilters((value) => !value)}>
              {showFilters ? <FilterAltOffIcon /> : <FilterAltIcon />}
            </IconButton>
          </Stack>

          <LazyTextField
            onChange={handleChangeQuery}
            value={query}
            TextFieldProps={{
              size: 'small',
              variant: 'standard',
              value: query,
              placeholder: formatMessage({
                id: 'search.dots',
                defaultMessage: 'Search...',
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
        </Stack>

        {showFilters && (
          <Collapse in={showFilters}>
            <Card>
              <Box p={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
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

        <Box>
          <DndContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2}>
              {renderSections()}
              <Grid item xs={12}>
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
          </DndContext>
        </Box>
      </Stack>
    </Box>
  );
}
