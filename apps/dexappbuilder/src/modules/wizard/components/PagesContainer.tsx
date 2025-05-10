import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';

import { AppConfirmDialog } from '@dexkit/ui';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  AppPageOptions,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import slugify from 'slugify';
import { BuilderKit } from '../constants';
import { PageSectionKey } from '../hooks/sections';
import AddPageDialog from './dialogs/AddPageDialog';
import PagesSection from './sections/PagesSection';

const ConfirmRemoveSectionDialog = dynamic(
  () => import('./dialogs/ConfirmRemoveSectionDialog'),
);

const CloneSectionDialog = dynamic(
  () => import('./dialogs/CloneSectionDialog'),
);

const ClonePageDialog = dynamic(() => import('./dialogs/ClonePageDialog'));

function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

type Callback = (cb: { [key: string]: AppPage }) => {
  [key: string]: AppPage;
};

interface Props {
  pages: {
    [key: string]: AppPage;
  };
  setPages: (cb: Callback) => void;
  theme: any;
  builderKit?: BuilderKit;
  showAddPage: boolean;
  setShowAddPage: (show: boolean) => void;
  onChangePages: () => void;
  onChangeSections: () => void;
  previewUrl?: string;
  site?: string;
}

export function PagesContainer({
  theme,
  builderKit,
  showAddPage,
  setShowAddPage,
  onChangePages,
  onChangeSections,
  previewUrl,
  pages,
  setPages,
  site,
}: Props) {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [selectedSectionIndex, setSelectedSectionindex] = useState<number>(-1);
  const [pageToClone, setPageToClone] = useState<string>();

  const [activeSection, setActiveSection] = useState<PageSectionKey>();

  const [sectionToClone, setSectionToClone] = useState<PageSectionKey>();

  const [selectedPage, setSelectedPage] = useState<string>();

  const handleEditPageSections = (page: string, index: number) => {
    setSelectedPage(page);
    setSelectedSectionindex(index);
  };

  const handleSavePageSections = (section: AppPageSection, index: number) => {
    setPages((value) => {
      if (selectedPage) {
        if (index === -1) {
          const newPages = { ...value };
          const newPage = newPages[selectedPage];
          const newSections = [...(newPage.sections || []), section];

          newPage.sections = newSections;
          newPages[selectedPage] = newPage;

          return newPages;
        } else {
          const newPages = structuredClone({ ...value });
          const newPage = newPages[selectedPage];
          const newSections = [...(newPage.sections || [])];

          newSections[index] = section;
          newPage.sections = newSections;
          newPages[selectedPage] = newPage;

          return newPages;
        }
      }

      return value;
    });
    onChangeSections();
  };

  const handleRemovePageSections = (page: string, index: number) => {
    setSelectedPage(page);
    setSelectedSectionindex(index);

    setShowConfirmRemove(true);
  };

  const handleAddPageSections = (page: string) => {
    setSelectedPage(page);
    setSelectedSectionindex(-1);
  };

  const handleCloseConfirmRemove = () => {
    setShowConfirmRemove(false);
    setSelectedSectionindex(-1);
    setSelectedPage(undefined);
  };

  const handleConfimRemoveSection = () => {
    setPages((value) => {
      const newPages = { ...value };

      if (selectedPage) {
        const newPage = { ...newPages[selectedPage] };

        const newSections = [...newPage.sections];

        newSections.splice(selectedSectionIndex, 1);

        newPage.sections = newSections;

        newPages[selectedPage] = newPage;
      }

      return newPages;
    });
    onChangeSections();
    setShowConfirmRemove(false);
  };

  const onEditPage = (pageOptions: AppPageOptions) => {
    setPages((value) => {
      const newPages = { ...value };

      if (pageOptions.key) {
        newPages[pageOptions.key] = {
          ...newPages[pageOptions.key],
          gatedConditions: pageOptions.gatedConditions,
          gatedPageLayout: pageOptions.gatedPageLayout,
          enableGatedConditions:
            pageOptions?.enableGatedConditions === undefined
              ? true
              : pageOptions?.enableGatedConditions,
        };
      }

      return newPages;
    });
  };

  const handleEditTitle = (page: string, title: string) => {
    setPages((value) => {
      const newPages = { ...value };

      newPages[page] = {
        ...newPages[page],
        title,
      };

      return newPages;
    });
  };

  const activeRef = useRef<NodeJS.Timeout | null>(null);

  const handleActivateSection = useCallback((key: PageSectionKey) => {
    if (activeRef.current != null) {
      clearTimeout(activeRef.current);
    }

    setActiveSection(key);

    activeRef.current = setTimeout(() => {
      setActiveSection(undefined);
      activeRef.current = null;
    }, 3000);
  }, []);

  const handleSwap = useCallback(
    (page: string, fromIndex: number, toIndex: number) => {
      setPages((value) => {
        const newPages = { ...value };

        const newPage = newPages[page];

        if (fromIndex === toIndex) {
          return { ...newPages };
        }

        const newSections = newPage.sections.map((x) => x);

        let [another] = newSections.splice(fromIndex, 1);

        newSections.splice(toIndex, 0, { ...another });

        newPage.sections = [...newSections];

        return { ...newPages, [page]: { ...newPage } };
      });

      onChangeSections();
      handleActivateSection({ index: toIndex, page });
    },
    [handleActivateSection, setPages, onChangeSections],
  );

  const handleHideDesktop = (page: string, index: number) => {
    setPages((value) => {
      const newPages = { ...value };

      const newPage = newPages[page];

      let section = { ...newPage.sections[index] };

      section.hideDesktop = !Boolean(section.hideDesktop);

      newPages[page].sections[index] = section;

      return newPages;
    });
  };

  const handleHideMobile = (page: string, index: number) => {
    setPages((value) => {
      const newPages = { ...value };

      const newPage = newPages[page];

      let section = { ...newPage.sections[index] };

      section.hideMobile = !Boolean(section.hideMobile);

      newPages[page].sections[index] = section;

      return newPages;
    });
    onChangeSections();
  };

  const handleCloseAddPage = () => {
    setShowAddPage(false);
    setPageToClone(undefined);
  };

  const [showCloneSection, setShowCloneSection] = useState(false);

  const [showClonePage, setShowClonePage] = useState(false);

  const handleClone = (page: string, index: number) => {
    setSectionToClone({ page, index });
    setShowCloneSection(true);
  };

  const handleConfirmCloneSection = (name: string, page?: string) => {
    setPages((value) => {
      const newPages = { ...value };

      if (page && page !== '' && sectionToClone) {
        const oldPage = newPages[sectionToClone.page];

        let clonedSection = oldPage.sections[sectionToClone.index];

        let newSections = [
          ...(newPages[page].sections || []),
          { ...clonedSection, title: name, name: name },
        ];

        newPages[page].sections = newSections;

        return { ...newPages };
      }

      if (sectionToClone) {
        const newPage = newPages[sectionToClone.page];

        const sections = [...newPage.sections];
        const cloneSection = {
          ...sections[sectionToClone.index],
          title: name,
          name: name,
        };

        sections.splice(sectionToClone.index + 1, 0, cloneSection);

        newPages[sectionToClone.page].sections = sections;
      }

      return newPages;
    });

    if (sectionToClone) {
      handleActivateSection({
        page: sectionToClone.page,
        index: sectionToClone.index + 1,
      });
    }

    onChangeSections();
    setShowCloneSection(false);
    setSectionToClone(undefined);
  };

  const handleClonePage = (page: string) => {
    setShowClonePage(true);
    setPageToClone(page);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmClonePage = (name: string) => {
    setPages((value) => {
      const newPages = { ...value };

      if (pageToClone) {
        const newPage = {
          ...newPages[pageToClone],
          title: name,
          uri: `/${slugify(name)}`,
        };

        newPages[`${pageToClone}-${generateRandomString(10)}`] = newPage;
      }

      return newPages;
    });

    onChangePages();

    setShowClonePage(false);
    setPageToClone(undefined);
    enqueueSnackbar(
      <FormattedMessage id="page.created" defaultMessage="Page Created" />,
      { variant: 'success' },
    );
  };

  const [showRemovePage, setShowRemovePage] = useState(false);
  const [pageToRemove, setPageToRemove] = useState<string>();

  const handleRemovePage = (page: string) => {
    setPageToRemove(page);
    setShowRemovePage(true);
  };

  const handelCloseConfirmRemove = () => {
    setShowRemovePage(false);
    setPageToRemove(undefined);
  };

  const handleConfirmRemove = () => {
    setPages((value) => {
      const newPages = { ...value };

      if (pageToRemove) {
        delete newPages[pageToRemove];
      }

      return newPages;
    });
    onChangePages();
    setShowRemovePage(false);
    setPageToRemove(undefined);
  };

  const handleCloseClonePage = () => {
    setShowClonePage(false);
  };

  const handleCloseCloneSection = () => {
    setShowCloneSection(false);
  };

  const handleAddPage = (page: AppPage) => {
    setPages((pages) => {
      const newPages = { ...pages };

      if (page.title) {
        newPages[slugify(page.title).toLowerCase()] = {
          ...page,
          sections: [],
          title: page.title,
        };
      }

      return newPages;
    });
    onChangePages();
  };

  const handleChangeName = (page: string, index: number, name: string) => {
    setPages((pages) => {
      const newPages = { ...pages };

      const newSections = [...newPages[page].sections];

      newSections[index].name = name;

      newPages[page] = { ...newPages[page], sections: newSections };

      return newPages;
    });
    onChangeSections();
  };

  const handleUpdateGatedConditions = (
    page: string,
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => {
    setPages((pages) => {
      const newPages = structuredClone({ ...pages });

      if (conditions) {
        newPages[page].gatedConditions = conditions;
      }

      if (layout) {
        newPages[page].gatedPageLayout = layout;
      }

      newPages[page].enableGatedConditions =
        enableGatedConditions === undefined ? true : enableGatedConditions;

      return newPages;
    });

    onChangeSections();
  };

  const handleUpdatePageLayout = (page: string, layout: PageSectionsLayout) => {
    setPages((pages) => {
      const newPages = structuredClone({ ...pages });

      newPages[page].layout = layout;

      return newPages;
    });
    onChangePages();
  };

  return (
    <>
      <AddPageDialog
        dialogProps={{
          open: showAddPage,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseAddPage,
        }}
        // clonedPage={pageToClone}
        onCancel={handleCloseAddPage}
        onSubmit={(item: AppPageOptions) => {
          onChangePages();
          onEditPage(item);
        }}
      />
      {sectionToClone && showCloneSection && (
        <CloneSectionDialog
          DialogProps={{
            open: showCloneSection,
            maxWidth: 'xs',
            fullWidth: true,
            onClose: handleCloseCloneSection,
          }}
          pages={pages}
          page={sectionToClone.page}
          onConfirm={handleConfirmCloneSection}
          section={pages[sectionToClone.page].sections[sectionToClone.index]}
        />
      )}
      {pageToClone && showClonePage && (
        <ClonePageDialog
          DialogProps={{
            open: showClonePage,
            maxWidth: 'xs',
            fullWidth: true,
            onClose: handleCloseClonePage,
          }}
          onConfirm={handleConfirmClonePage}
          page={pages[pageToClone]}
        />
      )}

      {pageToRemove && (
        <AppConfirmDialog
          onConfirm={handleConfirmRemove}
          DialogProps={{
            maxWidth: 'xs',
            fullWidth: true,
            open: showRemovePage,
            onClose: handelCloseConfirmRemove,
          }}
          title={
            <FormattedMessage
              id="delete.page.page"
              defaultMessage="Delete Page: {page}"
              values={{
                page: (
                  <Typography
                    component="span"
                    variant="inherit"
                    fontWeight="400"
                  >
                    {pages[pageToRemove].title}
                  </Typography>
                ),
              }}
            />
          }
          actionCaption={
            <FormattedMessage id="delete" defaultMessage="Delete" />
          }
        >
          <Typography variant="body1">
            <FormattedMessage
              id="are.you.sure.you.want.to.delete.this.page"
              defaultMessage="Are you sure you want to delete this page?"
            />
          </Typography>
        </AppConfirmDialog>
      )}

      {selectedPage && selectedSectionIndex > -1 && pages[selectedPage] && (
        <ConfirmRemoveSectionDialog
          dialogProps={{
            open: showConfirmRemove,
            maxWidth: 'xs',
            fullWidth: true,
            onClose: handleCloseConfirmRemove,
          }}
          section={pages[selectedPage].sections[selectedSectionIndex]}
          onConfirm={handleConfimRemoveSection}
        />
      )}

      <PagesSection
        builderKit={builderKit}
        pages={pages}
        theme={theme}
        page={selectedPage}
        onChangeName={handleChangeName}
        onEditTitle={handleEditTitle}
        onUpdatePageLayout={handleUpdatePageLayout}
        sections={selectedPage ? pages[selectedPage]?.sections : []}
        onEditPage={onEditPage}
        onRemovePage={handleRemovePage}
        onSaveSection={handleSavePageSections}
        onRemove={handleRemovePageSections}
        onSwap={handleSwap}
        onClone={handleClone}
        onAddPage={handleAddPage}
        onClonePage={handleClonePage}
        onHideDesktop={handleHideDesktop}
        onHideMobile={handleHideMobile}
        onEdit={handleEditPageSections}
        onAdd={handleAddPageSections}
        activeSection={activeSection}
        currentIndex={selectedSectionIndex}
        onUpdateGatedConditions={handleUpdateGatedConditions}
        section={
          selectedPage && selectedSectionIndex > -1
            ? pages[selectedPage]?.sections[selectedSectionIndex]
            : undefined
        }
        previewUrl={previewUrl}
        site={site}
      />
    </>
  );
}
