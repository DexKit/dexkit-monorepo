import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import { Box, Button, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Field, FieldArray, getIn, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { CollectionItemsForm } from '../types';
import CollectionItemAttributeForm from './CollectionItemAttributeForm';
import { ImageFormUpload } from './ImageFormUpload';

interface Props {
  itemIndex: number;
  onlySingleMint: boolean;
  allowMultipleQuantity: boolean;
}

export default function CollectionItemForm({
  itemIndex,
  onlySingleMint = false,
  allowMultipleQuantity = true,
}: Props) {
  const { setFieldValue, values, errors } =
    useFormikContext<CollectionItemsForm>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            mb: isMobile ? 2 : 0
          }}>
            <ImageFormUpload
              value={values.items[itemIndex]?.file || ''}
              onSelectFile={(file: any) =>
                setFieldValue(`items[${itemIndex}].file`, file)
              }
              error={Boolean(
                errors.items && (errors.items[itemIndex] as any)?.file,
              )}
              imageHeight={isMobile ? 16 : 20}
              imageWidth={isMobile ? 16 : 20}
            />
          </Box>
          {/*   <Box pt={2}>
            <GenerateAIImageButton
              description={values.items[itemIndex].description}
              onImageUrl={(imageUrl) =>
                setFieldValue(`items[${itemIndex}].file`, imageUrl)
              }
            />
            </Box>*/}
        </Grid>
        <Grid size={{ xs: 12, md: 'grow' }}>
          <Stack spacing={isMobile ? 1.5 : 2}>
            {allowMultipleQuantity === true && (
              <Field
                component={TextField}
                type={'number'}
                name={`items[${itemIndex}].quantity`}
                label={
                  <FormattedMessage id="quantity" defaultMessage="Quantity" />
                }
                defaultValue={1}
                fullWidth
              />
            )}
            <CompletationProvider
              onCompletation={(output: string) => {
                setFieldValue(`items[${itemIndex}].name`, output);
              }}
              initialPrompt={getIn(values, `items[${itemIndex}].name`)}
            >
              {({ inputAdornment, ref }) => (
                <Field
                  component={TextField}
                  name={`items[${itemIndex}].name`}
                  label={<FormattedMessage id="name" defaultMessage="Name" />}
                  fullWidth
                  inputRef={ref}
                  InputProps={{
                    endAdornment: inputAdornment('end'),
                  }}
                />
              )}
            </CompletationProvider>
            <CompletationProvider
              onCompletation={(output: string) => {
                setFieldValue(`items[${itemIndex}].description`, output);
              }}
              initialPrompt={getIn(values, `items[${itemIndex}].description`)}
            >
              {({ inputAdornment, ref }) => (
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
                  rows={isMobile ? 2 : 3}
                  inputRef={ref}
                  InputProps={{
                    endAdornment: inputAdornment('end'),
                  }}
                />
              )}
            </CompletationProvider>

            {(values.items[itemIndex] as any)?.attributes?.length > 0 && (
              <Box>
                <Stack spacing={isMobile ? 1 : 2}>
                  {values.items[itemIndex].attributes?.map(
                    (_: any, index: number) => (
                      <CollectionItemAttributeForm
                        key={index}
                        index={index}
                        itemSelector={`items[${itemIndex}].`}
                      />
                    ),
                  )}
                </Stack>
              </Box>
            )}

            <Box>
              <FieldArray
                name={`items[${itemIndex}].attributes`}
                render={(arrayHelper: any) => (
                  <Button
                    variant="outlined"
                    onClick={() => arrayHelper.push({})}
                    fullWidth={isMobile}
                    size={isMobile ? 'small' : 'medium'}
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
