import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

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
  setCurrentPage: (page: AppPage) => void;
}

export default function SeoSection({
  seoForm,
  onSave,
  onHasChanges,
  currentPage,
  pages,
  setCurrentPage,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onViewPage = (slug: string) => {
    if (pages[slug]) {
      setCurrentPage(pages[slug]);
    }
  };

  const handleSave = (form: SeoForm) => {
    onSave(form, currentPage.key as string);
  };

  return (
    <Box sx={{
      width: '100%',
      px: isMobile ? 0.5 : 0
    }}>
      <Stack spacing={isMobile ? 1.5 : 2}>
        <Box sx={{ mb: isMobile ? 0.5 : 1 }}>
          <PagesMenu
            onClickMenu={onViewPage}
            pages={pages}
            currentPage={currentPage}
          />
        </Box>
        <SeoSectionForm
          initialValues={seoForm[currentPage.key as string]}
          onHasChanges={onHasChanges}
          onSubmit={handleSave}
        />
      </Stack>
    </Box>
  );
}
