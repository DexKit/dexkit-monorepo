import { Stack } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import { SeoForm } from '../../types';
import PagesMenu from '../PagesMenu';
import SeoSectionForm from './SeoSectionForm';

interface Props {
  seoForm: { [key: string]: SeoForm };
  currentPage: AppPage;
  pages: { [key: string]: AppPage };
  onSave: (form: SeoForm, slug: string) => void;
  onHasChanges: (hasChanges: boolean) => void;
  setCurrentPage: Dispatch<SetStateAction<AppPage>>;
}

export default function SeoSection({
  seoForm,
  onSave,
  onHasChanges,
  currentPage,
  pages,
  setCurrentPage,
}: Props) {
  const onViewPage = (slug: string) => {
    if (pages[slug]) {
      setCurrentPage(pages[slug]);
    }
  };

  const handleSave = (form: SeoForm) => {
    onSave(form, currentPage.key as string);
  };

  return (
    <Stack spacing={2}>
      <PagesMenu
        onClickMenu={onViewPage}
        pages={pages}
        currentPage={currentPage}
      />
      <SeoSectionForm
        initialValues={seoForm[currentPage.key as string]}
        onHasChanges={onHasChanges}
        onSubmit={handleSave}
      />
    </Stack>
  );
}
