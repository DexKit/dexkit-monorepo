import {
  AppPageSection,
  CustomEditorSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { CssVarsTheme, Stack, Theme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  AppPageOptions,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { BuilderKit } from '../../constants';
import { PageSectionKey } from '../../hooks/sections';
import PagesSectionPage from '../section-config/PagesSectionPage';
const EditSectionDialog = dynamic(
  () => import('../section-config/dialogs/EditSectionDialog'),
);
const PageEditorDialog = dynamic(() => import('../dialogs/PageEditorDialog'));

interface Props {
  pages: { [key: string]: AppPage };
  page?: string;
  sections: AppPageSection[];
  section?: AppPageSection;
  currentIndex: number;
  onEditPage: (pageOptions: AppPageOptions) => void;
  onHideDesktop: (page: string, index: number) => void;
  onHideMobile: (page: string, index: number) => void;
  onSaveSection: (section: AppPageSection, index: number) => void;
  onRemove: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onAdd: (page: string) => void;
  onSwap: (page: string, index: number, other: number) => void;
  onClone: (page: string, index: number) => void;
  onClonePage: (page: string) => void;
  onAddPage: (page: AppPage) => void;
  onEditTitle: (page: string, title: string) => void;
  onChangeName: (page: string, index: number, name: string) => void;
  onRemovePage: (page: string) => void;
  onUpdatePageLayout: (page: string, layout: PageSectionsLayout) => void;
  onUpdateGatedConditions: (
    page: string,
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
  ) => void;
  theme?: Omit<Theme, 'palette'> & CssVarsTheme;
  builderKit?: BuilderKit;
  previewUrl?: string;
  activeSection?: PageSectionKey;
  site?: string;
}

export default function PagesSection({
  builderKit,
  sections,
  section,
  page,
  theme,
  activeSection,
  onEditPage,
  onSaveSection: onSave,
  onHideDesktop,
  onUpdatePageLayout,
  onUpdateGatedConditions,
  onHideMobile,
  onChangeName,
  onRemovePage,
  onEditTitle,
  onRemove,
  onEdit,
  onClone,
  onClonePage,
  onAddPage,
  onAdd,
  onSwap,
  currentIndex,
  pages,
  previewUrl,
  site,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleAddSection = (page: string, custom?: boolean) => {
    if (custom) {
      onAdd(page);
      setIsOpenEditor(true);
    } else {
      onAdd(page);
      setIsEdit(false);
      setIsOpen(true);
    }
  };

  const handleEdit = (page: string, index: number) => {
    onEdit(page, index);

    if (sections[index]?.type === 'custom') {
      setIsOpenEditor(true);
    } else {
      setIsOpen(true);
    }
    setIsEdit(true);
  };

  const handleSave = (section: AppPageSection, index: number) => {
    onSave(section, index);
  };

  const handleSaveName = (name: string) => {
    if (page) {
      onChangeName(page, currentIndex, name);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseEditor = () => {
    setIsOpenEditor(false);
  };

  return (
    <>
      {isOpen && (
        <EditSectionDialog
          dialogProps={{
            open: isOpen,
            fullScreen: true,
            fullWidth: true,
            onClose: handleClose,
          }}
          builderKit={builderKit}
          isEdit={isEdit}
          section={section}
          onSave={handleSave}
          onSaveName={handleSaveName}
          index={currentIndex}
        />
      )}
      {isOpenEditor && (
        <PageEditorDialog
          dialogProps={{
            open: isOpenEditor,
            fullScreen: true,
            onClose: handleCloseEditor,
          }}
          builderKit={builderKit}
          section={section as CustomEditorSection}
          index={currentIndex}
          onSave={handleSave}
        />
      )}

      <Stack spacing={2}>
        <PagesSectionPage
          pages={pages}
          onUpdatePageLayout={onUpdatePageLayout}
          onRemovePage={onRemovePage}
          onEditTitle={onEditTitle}
          onEditPage={onEditPage}
          onRemove={onRemove}
          onEdit={handleEdit}
          onAddPage={onAddPage}
          onAdd={handleAddSection}
          onChangeName={onChangeName}
          onClonePage={onClonePage}
          onHideDesktop={onHideDesktop}
          onHideMobile={onHideMobile}
          onClone={onClone}
          onSwap={onSwap}
          theme={theme}
          site={site}
          previewUrl={previewUrl}
          activeSection={activeSection}
          onUpdateGatedConditions={onUpdateGatedConditions}
        />
      </Stack>
    </>
  );
}
