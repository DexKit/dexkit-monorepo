import {
  Box,
  Button,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { FormattedMessage } from 'react-intl';

import LazyYoutubeFrame from '@dexkit/ui/components/LazyYoutubeFrame';
import { VideoEmbedType } from '@dexkit/ui/modules/wizard/types/config';
import {
  AppPageSection,
  VideoEmbedAppPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useDebounce } from '../../../../hooks/misc';

interface Form {
  videoUrl: string;
  title: string;
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  videoUrl: Yup.string().required(),
  title: Yup.string().required(),
});

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: VideoEmbedAppPageSection;
}

export default function VideoSectionForm({
  onSave,
  onCancel,
  section,
  onChange,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getVideoType = (url: string): VideoEmbedType => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'custom';
  };

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    if (onSave) {
      onSave({
        videoUrl: values.videoUrl,
        type: 'video',
        embedType: getVideoType(values.videoUrl),
        title: values.title,
      });
    }
  };

  const formik = useFormik({
    initialValues: section
      ? {
        videoUrl: section.videoUrl,
        title: section.title,
      }
      : { videoUrl: '', title: '' },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  const videoUrl = useDebounce<string>(formik.values.videoUrl, 500);

  useEffect(() => {
    onChange({
      videoUrl: formik.values.videoUrl,
      type: 'video',
      embedType: getVideoType(formik.values.videoUrl),
      title: formik.values.title,
    });
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ px: isMobile ? 2 : 0 }}>
        <Stack spacing={isMobile ? 1.5 : 2}>
        <TextField
          size={isMobile ? "small" : "medium"}
          label={<FormattedMessage id="title" defaultMessage="Title" />}
          fullWidth
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.title)}
          required
          helperText={
            Boolean(formik.errors.title) ? formik.errors.title : undefined
          }
        />
        
        <TextField
          size={isMobile ? "small" : "medium"}
          label={
            <FormattedMessage id="video.url" defaultMessage="Video URL" />
          }
          required
          fullWidth
          type="url"
          name="videoUrl"
          value={formik.values.videoUrl}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.videoUrl)}
          helperText={
            Boolean(formik.errors.videoUrl)
              ? formik.errors.videoUrl
              : undefined
          }
        />

        <Box
          sx={{
            display:
              videoUrl &&
                formik.isValid
                ? 'block'
                : 'none',
            mt: isMobile ? 1 : 2,
            '& iframe': {
              maxWidth: '100%',
              height: isMobile ? '180px' : 'auto'
            }
          }}
        >
          {getVideoType(videoUrl) === 'youtube' ? (
            <LazyYoutubeFrame url={videoUrl} />
          ) : (
            <iframe
              src={videoUrl}
              title={formik.values.title}
              width="100%"
              height={isMobile ? '180px' : '200px'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </Box>

        <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ mt: isMobile ? 1 : 0 }}>
          <Button onClick={onCancel} size={isMobile ? "small" : "medium"}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Stack>
      </Box>
    </form>
  );
}
