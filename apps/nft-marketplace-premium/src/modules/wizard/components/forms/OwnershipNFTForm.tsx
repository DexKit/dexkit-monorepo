import CollectionItemAttributeForm from '@/modules/contract-wizard/components/CollectionItemAttributeForm';
import { GenerateAIImageButton } from '@/modules/contract-wizard/components/GenerateAIImageButton';
import { ImageFormUpload } from '@/modules/contract-wizard/components/ImageFormUpload';
import { CollectionOwnershipNFTFormType } from '@/modules/contract-wizard/types';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Field, FieldArray, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

interface Props {}

export default function OwnershipNFTForm({}: Props) {
  const { setFieldValue, values, errors } =
    useFormikContext<CollectionOwnershipNFTFormType>();

  return (
    <Form>
      <Grid container spacing={2}>
        <Grid item>
          <Stack spacing={2}>
            <Box>
              <Typography>
                <b>
                  <FormattedMessage
                    id={'nft.image'}
                    defaultMessage={'NFT image'}
                  />
                </b>
              </Typography>
            </Box>
            <Stack
              spacing={2}
              direction={'row'}
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <ImageFormUpload
                value={values?.image || ''}
                onSelectFile={(file) => setFieldValue(`image`, file)}
                error={Boolean(errors && (errors as any)?.image)}
              />
              <Typography>
                <FormattedMessage id={'or'} defaultMessage={'or'} />
              </Typography>
              <Box>
                <GenerateAIImageButton
                  description={values.description}
                  onImageUrl={(imageUrl) => setFieldValue(`image`, imageUrl)}
                />
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Box>
              <Typography>
                <b>
                  <FormattedMessage
                    id={'nft.metadata'}
                    defaultMessage={'NFT metadata'}
                  />
                </b>
              </Typography>
            </Box>
            <Field
              component={TextField}
              sx={{ maxWidth: '500px' }}
              fullWidth
              name={`name`}
              label={<FormattedMessage id="name" defaultMessage="Name" />}
            />
            <Field
              sx={{ maxWidth: '500px' }}
              component={TextField}
              name={`description`}
              label={
                <FormattedMessage
                  id="nft.description"
                  defaultMessage="NFT description"
                />
              }
              fullWidth
              multiline
              rows={5}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Box>
              <Typography>
                <b>
                  <FormattedMessage
                    id={'nft.attributes'}
                    defaultMessage={'NFT attributes'}
                  />
                </b>
              </Typography>
            </Box>

            {(values as any)?.attributes?.length > 0 && (
              <Box>
                <Stack spacing={2}>
                  {values.attributes?.map((_, index: number) => (
                    <CollectionItemAttributeForm
                      key={index}
                      index={index}
                      itemSelector={''}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <FieldArray
                name={`attributes`}
                render={(arrayHelper) => (
                  <Button
                    startIcon={<AddIcon />}
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
    </Form>
  );
}
