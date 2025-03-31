import { Box, Button, Grid, Stack } from '@mui/material';
import { Field, FieldArray, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionItemsForm } from '../types';
import CollectionItemAttributeForm from './CollectionItemAttributeForm';
import ImageUploadButton from './ImageUploadButton';

interface Props {
  itemIndex: number;
}

export default function CollectionItemForm({ itemIndex }: Props) {
  const [attributes, setAttributes] = useState<any[]>([]);

  const handleAdd = () => {
    return setAttributes((value) => [...value, null]);
  };

  const { setFieldValue, values, errors } =
    useFormikContext<CollectionItemsForm>();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <ImageUploadButton
            onChange={(file: File | null) => {
              setFieldValue(`items[${itemIndex}].file`, file);
            }}
            file={values.items[itemIndex]?.file}
            error={Boolean(
              errors.items && (errors.items[itemIndex] as any)?.file
            )}
          />
        </Grid>
        <Grid item xs>
          <Stack spacing={2}>
            <Field
              component={TextField}
              name={`items[${itemIndex}].name`}
              label={<FormattedMessage id="name" defaultMessage="Name" />}
              fullWidth
            />
            <Field
              component={TextField}
              name={`items[${itemIndex}].description`}
              label={
                <FormattedMessage
                  id="description"
                  defaultMessage="Description"
                />
              }
              fullWidth
              multiline
              rows={3}
            />
            {values.items[itemIndex].attributes?.length > 0 && (
              <Box>
                <Stack spacing={2}>
                  {values.items[itemIndex].attributes?.map(
                    (_, index: number) => (
                      <CollectionItemAttributeForm
                        key={index}
                        index={index}
                        itemIndex={itemIndex}
                      />
                    )
                  )}
                </Stack>
              </Box>
            )}

            <Box>
              <FieldArray
                name={`items[${itemIndex}].attributes`}
                render={(arrayHelper) => (
                  <Button
                    variant="outlined"
                    onClick={() => arrayHelper.push({})}
                  >
                    <FormattedMessage
                      id="add.attribute"
                      defaultMessage="Add attribute"
                    />
                  </Button>
                )}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
