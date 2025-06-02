import LazyTextField from '@dexkit/ui/components/LazyTextField';

import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  GatedCondition,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useCallback, useContext, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PageSectionKey } from '../../hooks/sections';
import { PagesContext } from '../containers/EditWizardContainer';
import PreviewPageDialog from '../dialogs/PreviewPageDialog';
import PageGatedContent from '../gated-content/PageGatedContent';
import Page from './Page';
import PageSections from './PageSections';
import PagesPagination from './PagesPagination';

const EditPageSectionsLayoutDialog = dynamic(
  () => import('../dialogs/EditPageSectionsLayoutDialog'),
);

export interface PagesProps {
  pages: {
    [key: string]: AppPage;
  };
  onSwap: (page: string, index: number, other: number) => void;
  onAction: (action: string, page: string, index: number) => void;
  onClonePage: (page: string) => void;
  onAdd: (page: string, custom?: boolean) => void;
  onAddPage: () => void;
  onEditTitle: (page: string, title: string) => void;
  onUpdateGatedConditions: (
    page: string,
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => void;
  onUpdatePageLayout: (page: string, layout: PageSectionsLayout) => void;
  onRemovePage: (page: string) => void;
  onChangeName: (page: string, index: number, name: string) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  activeSection?: PageSectionKey;
  site?: string;
  previewUrl?: string;
}

export default function Pages({
  pages,
  onSwap,
  onAction,
  theme,
  activeSection,
  onAdd,
  onClonePage,
  onUpdatePageLayout,
  onUpdateGatedConditions,
  onRemovePage,
  onEditTitle,
  onAddPage,
  onChangeName,
  site,
  previewUrl,
}: PagesProps) {
  const [query, setQuery] = useState('');

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const keys = useMemo(() => {
    return Object.keys(pages).filter((key) => {
      const page: AppPage = pages[key];

      const hasTitle =
        page.title !== undefined && page.title.toLowerCase().search(query) > -1;
      const hasKey = key.search(query) > -1;

      return hasTitle || hasKey;
    });
  }, [pages, query]);

  const [offset, limit] = useMemo(() => {
    return [page * pageSize, page * pageSize + pageSize];
  }, [keys, page, pageSize]);

  const pageList = useMemo(() => {
    return keys.slice(offset, limit);
  }, [keys, offset, limit, pages]);

  const { setSelectedKey, setIsEditPage, isEditPage, selectedKey, setOldPage } =
    useContext(PagesContext);

  const [showPreview, setShowPreview] = useState(false);

  const handleSelect = (id: string) => {
    return () => {
      const page = structuredClone(pages[id]);

      setIsEditPage(true);
      setSelectedKey(id);
      setOldPage(page);
    };
  };

  const handleSwap = (page: string) => {
    return (index: number, other: number) => {
      onSwap(page, index, other);
    };
  };

  const handleAction = useCallback(
    (page: string) => {
      return (action: string, index: number) => {
        onAction(action, page, index);
      };
    },
    [onAction],
  );

  const handleShowPreview = (pageKey: string) => {
    return () => {
      setSelectedKey(pageKey);
      setShowPreview(true);
    };
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handlePageClose = () => {
    setSelectedKey(undefined);
    setIsEditPage(false);
  };

  const handleAdd = (page: string, custom?: boolean) => {
    return () => {
      onAdd(page, custom);
    };
  };

  const handleClonePage = (page: string) => {
    return () => {
      onClonePage(page);
    };
  };

  const [isEditGate, setIsEditGate] = useState(false);

  const handleEditCondtions = (pageKey: string) => {
    return () => {
      const page = structuredClone(pages[pageKey]);

      setSelectedKey(pageKey);
      setIsEditGate(true);
      setOldPage(page);
    };
  };

  const handleChangeName = (page: string) => {
    return (index: number, name: string) => {
      onChangeName(page, index, name);
    };
  };

  const handleSaveGatedConditions = (
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => {
    if (selectedKey) {
      onUpdateGatedConditions(
        selectedKey,
        conditions,
        layout,
        enableGatedConditions === undefined ? true : enableGatedConditions,
      );
    }
  };

  const { formatMessage } = useIntl();

  const handleCloseGate = () => {
    setIsEditGate(false);
    setSelectedKey(undefined);
  };

  const [showLayoutEdit, setShowLayoutEdit] = useState(false);

  const handleCloseLayout = () => {
    setShowLayoutEdit(false);
  };

  const handleEditLayout = () => {
    setShowLayoutEdit(true);
  };

  const handleConfirmEditLayout = (layout: PageSectionsLayout) => {
    if (selectedKey) {
      onUpdatePageLayout(selectedKey, layout);
    }
  };

  const renderPageLayoutDialog = () => {
    return (
      <EditPageSectionsLayoutDialog
        DialogProps={{
          open: showLayoutEdit,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseLayout,
        }}
        layout={selectedKey ? pages[selectedKey].layout : undefined}
        onConfirm={handleConfirmEditLayout}
      />
    );
  };

  const renderPreviewDialog = () => {
    if (showPreview && selectedKey) {
      return (
        <CssVarsProvider theme={theme}>
          <PreviewPageDialog
            dialogProps={{
              open: showPreview,
              maxWidth: 'xl',
              fullWidth: true,
              onClose: handleClosePreview,
            }}
            disabled={true}
            sections={pages[selectedKey].sections}
            name={pages[selectedKey]?.title}
            page={selectedKey}
            site={site}
            layout={pages[selectedKey].layout}
          />
        </CssVarsProvider>
      );
    }
  };

  if (selectedKey !== undefined && isEditGate) {
    return (
      <PageGatedContent
        page={pages[selectedKey]}
        onSaveGatedConditions={handleSaveGatedConditions}
        onClose={handleCloseGate}
      />
    );
  }

  if (selectedKey !== undefined && isEditPage) {
    return (
      <Box px={{ sm: 4 }}>
        {renderPreviewDialog()}
        {renderPageLayoutDialog()}
        <Grid container spacing={2}>
          {isEditPage && (
            <Grid item xs={12}>
              <PageSections
                onAddSection={handleAdd(selectedKey)}
                onAddCustomSection={handleAdd(selectedKey, true)}
                onEditTitle={onEditTitle}
                pageKey={selectedKey}
                page={pages[selectedKey]}
                onSwap={handleSwap(selectedKey)}
                onAction={handleAction(selectedKey)}
                onClose={handlePageClose}
                onAdd={handleAdd(selectedKey)}
                onPreview={handleShowPreview(selectedKey)}
                activeSection={activeSection}
                onClone={() => onClonePage(selectedKey)}
                onChangeName={handleChangeName(selectedKey)}
                onEditLayout={handleEditLayout}
                siteId={site}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }

  return (
    <>
      {renderPreviewDialog()}
      {renderPageLayoutDialog()}
      <Box sx={{ px: { sm: 4 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={onAddPage}
              size="small"
              startIcon={<Add />}
              sx={{ my: 2 }}
            >
              <FormattedMessage id="New.page" defaultMessage="New page" />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight="500" variant="h6">
                  <FormattedMessage id="page.list" defaultMessage="Page list" />
                </Typography>
                <LazyTextField
                  onChange={handleChangeQuery}
                  value={query}
                  TextFieldProps={{
                    size: 'small',
                    variant: 'standard',
                    placeholder: formatMessage({
                      id: 'search.dots',
                      defaultMessage: 'Search...',
                    }),
                    value: query,
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
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Grid container spacing={2}>
                {pageList.map((pageKey, index) => (
                  <Grid item xs={12} key={index}>
                    <Page
                      pageKey={pageKey}
                      page={pages[pageKey]}
                      onSelect={handleSelect(pageKey)}
                      onPreview={handleShowPreview(pageKey)}
                      onClone={handleClonePage(pageKey)}
                      onEditConditions={handleEditCondtions(pageKey)}
                      onRemove={() => onRemovePage(pageKey)}
                      previewUrl={previewUrl}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <PagesPagination
                pageSize={pageSize}
                from={offset}
                to={limit}
                onChange={(pageSize) => {
                  setPage(0);
                  setPageSize(pageSize);
                }}
                onChangePage={(page: number) => setPage(page)}
                count={keys.length}
                pageCount={pageList.length}
                page={page}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
