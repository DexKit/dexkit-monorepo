import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
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
  videoType: string;
  videoUrl: string;
  title: string;
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  videoType: Yup.string().required(),
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
  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    if (onSave) {
      onSave({
        videoUrl: values.videoUrl,
        type: 'video',
        embedType: values.videoType as VideoEmbedType,
        title: values.title,
      });
    }
  };

  const formik = useFormik({
    initialValues: section
      ? {
          videoType: section.embedType,
          videoUrl: section.videoUrl,
          title: section.title,
        }
      : { videoType: 'youtube', videoUrl: '', title: '' },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  const videoUrl = useDebounce<string>(formik.values.videoUrl, 500);

  useEffect(() => {
    onChange({
      videoUrl: formik.values.videoUrl,
      type: 'video',
      embedType: formik.values.videoType as VideoEmbedType,
      title: formik.values.title,
    });
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>
              <FormattedMessage id="video.type" defaultMessage="Video Type" />
            </InputLabel>
            <Select
              required
              label={
                <FormattedMessage id="video.type" defaultMessage="Video Type" />
              }
              fullWidth
              name="videoType"
              value={formik.values.videoType}
              onChange={formik.handleChange}
            >
              <MenuItem value="youtube">
                <FormattedMessage id="youtube" defaultMessage="Youtube" />
              </MenuItem>
              <MenuItem value="vimeo" disabled>
                <FormattedMessage id="youtube" defaultMessage="Vimeo" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
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
        </Grid>
        <Grid item xs={12}>
          <TextField
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
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display:
              formik.values.videoType === 'youtube' &&
              videoUrl &&
              formik.isValid
                ? 'block'
                : 'none',
          }}
        >
          <LazyYoutubeFrame url={videoUrl} />
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button onClick={onCancel}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button type="submit" variant="contained" color="primary">
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
