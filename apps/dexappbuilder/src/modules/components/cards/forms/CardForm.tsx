import { DKMDEditorInput } from '@dexkit/ui/components';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { z } from 'zod';
import { cardSchema } from '../schemas';
import { CardProps } from '../types/card';

function validate(values: CardProps) {
  try {
    cardSchema.parse(values);
    return {};
  } catch (e) {
    const errors: Record<string, string> = {};
    if (e instanceof z.ZodError) {
      e.errors.forEach(err => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
    }
    return errors;
  }
}

export const CardForm: React.FC<{
  initialValues: CardProps;
  onSubmit: (values: CardProps) => void;
  onChange?: (values: CardProps) => void;
}> = ({ initialValues, onSubmit, onChange }) => {
  const formik = useFormik<CardProps>({
    initialValues: {
      ...initialValues,
      actions: initialValues.actions && initialValues.actions.length > 0 ? initialValues.actions : [{ label: '', href: '' }],
    },
    validate,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (onChange) {
      onChange(formik.values);
    }
  }, [formik.values, onChange]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <TextField
        label={<FormattedMessage id="card.title" defaultMessage="Title" />}
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={!!formik.errors.title}
        helperText={formik.errors.title}
        required
      />
      <DKMDEditorInput
        label={<FormattedMessage id="card.description" defaultMessage="Description" />}
        value={formik.values.description || ''}
        onChange={(value: string) => formik.setFieldValue('description', value)}
        error={!!formik.errors.description}
        errorText={formik.errors.description}
        helperText={<FormattedMessage id="card.description.helper" defaultMessage="Use markdown formatting and AI assistance for rich content" />}
        height={200}
      />
      <TextField
        label={<FormattedMessage id="card.imageUrl" defaultMessage="Image URL" />}
        name="image"
        value={formik.values.image}
        onChange={formik.handleChange}
        error={!!formik.errors.image}
        helperText={formik.errors.image}
      />
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        <FormattedMessage id="card.action" defaultMessage="Action Button" />
      </Typography>
      <TextField
        label={<FormattedMessage id="card.action.label" defaultMessage="Button Label" />}
        name="actions[0].label"
        value={formik.values.actions?.[0]?.label || ''}
        onChange={formik.handleChange}
        sx={{ mb: 1 }}
      />
      <TextField
        label={<FormattedMessage id="card.action.href" defaultMessage="Button Link (href)" />}
        name="actions[0].href"
        value={formik.values.actions?.[0]?.href || ''}
        onChange={formik.handleChange}
        sx={{ mb: 1 }}
      />
      <Button type="submit" variant="contained">
        <FormattedMessage id="card.save" defaultMessage="Save" />
      </Button>
    </Box>
  );
}; 