import {
  AppConfig,
  AppPage,
  PageSeo,
} from '@dexkit/ui/modules/wizard/types/config';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SeoForm } from '../../types';
import SeoSection from '../sections/SeoSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}
export default function SeoWizardContainer({
  config,
  onSave,
  onHasChanges,
}: Props) {
  const [currentPage, setCurrentPage] = useState<AppPage>(config.pages['home']);
  const handleSaveSeoForm = (form: SeoForm, slug: string) => {
    setSeoForm({ [slug]: form });
    const seo: { [key: string]: PageSeo } = { ...config.seo };
    Object.keys(seoForm).forEach((key) => {
      seo[key] = {
        title: seoForm[key].title,
        description: seoForm[key].description,
        images: [{ url: seoForm[key].shareImageUrl }],
      };
    });
    seo[slug] = {
      title: form.title,
      description: form.description,
      images: [{ url: form.shareImageUrl }],
    };
    const newConfig = { ...config, seo };
    onSave(newConfig);
  };

  const [seoForm, setSeoForm] = useState<{ [key: string]: SeoForm }>({
    home: {
      title: (config.seo && config.seo['home']?.title) || '',
      description: (config.seo && config.seo['home']?.description) || '',
      shareImageUrl: (config.seo && config.seo['home']?.images[0].url) || '',
    },
  });

  useEffect(() => {
    setSeoForm({
      [`${currentPage.key}`]: {
        title:
          (config.seo &&
            currentPage.key &&
            config.seo[currentPage.key]?.title) ||
          '',
        description:
          (config.seo &&
            currentPage.key &&
            config.seo[currentPage.key]?.description) ||
          '',
        shareImageUrl:
          (config.seo &&
            currentPage.key &&
            config.seo[currentPage.key]?.images[0].url) ||
          '',
      },
    });
  }, [currentPage]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="SEO" defaultMessage="SEO" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="seo.wizard.description"
              defaultMessage="Configure your app's SEO"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <SeoSection
          seoForm={seoForm}
          onSave={handleSaveSeoForm}
          pages={config.pages}
          onHasChanges={onHasChanges}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Grid>
    </Grid>
  );
}
