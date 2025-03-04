import { ImageFormUpload } from '@/modules/contract-wizard/components/ImageFormUpload';
import { EVM_CHAINS } from '@dexkit/evm-chains/constants';
import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import { SiteMetadata } from '@dexkit/ui/modules/wizard/types';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Field, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

const DKMDEditor = dynamic(() => import('@dexkit/ui/components/DKMDEditor'));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UseCases = [
  'Swap',
  'NFT Marketplace',
  'Exchange',
  'Blog',
  'Token project',
  'Staking project',
  'Donation',
  'Gamification',
  'Gated content',
  'Web3',
];

export default function SiteMetadataForm() {
  const { setFieldValue, values, errors } = useFormikContext<SiteMetadata>();

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setFieldValue('chainIds', value);
  };

  const handleChangeUsecase = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFieldValue('usecases', value);
  };

  const renderValue = useCallback(
    (selected: number[]) => {
      return selected
        .map((cid) => EVM_CHAINS.find((c) => c.chainId === cid)?.name)
        .join(',');
    },
    [EVM_CHAINS],
  );

  return (
    <Form>
      <Grid container spacing={2}>
        <Grid item>
          <Stack spacing={2}>
            <Box>
              <Typography>
                <b>
                  <FormattedMessage
                    id={'site.metada.image'}
                    defaultMessage={'Site metadata image'}
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
                value={values?.imageURL || ''}
                onSelectFile={(file) => setFieldValue(`imageURL`, file)}
                error={Boolean(errors && (errors as any)?.imageURL)}
              />
              {/*  <Typography>
                <FormattedMessage id={'or'} defaultMessage={'or'} />
              </Typography>
             <Box>
                <GenerateAIImageButton
                  description={values.description}
                  onImageUrl={(imageUrl) => setFieldValue(`image`, imageUrl)}
                />
  </Box>*/}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Box>
              <Typography>
                <b>
                  <FormattedMessage
                    id={'site.metadata'}
                    defaultMessage={'Site metadata'}
                  />
                </b>
              </Typography>
            </Box>
            <CompletationProvider
              onCompletation={(output) => setFieldValue('title', output)}
              initialPrompt={values?.title || ''}
            >
              {({ inputAdornment, ref }) => (
                <Field
                  component={TextField}
                  sx={{ maxWidth: '500px' }}
                  fullWidth
                  name={`title`}
                  label={
                    <FormattedMessage
                      id="site.title"
                      defaultMessage="Site title"
                    />
                  }
                  inputRef={ref}
                  InputProps={{
                    endAdornment: inputAdornment('end'),
                  }}
                />
              )}
            </CompletationProvider>
            <CompletationProvider
              onCompletation={(output) => setFieldValue('subtitle', output)}
              initialPrompt={values?.subtitle || ''}
            >
              {({ inputAdornment, ref }) => (
                <Field
                  component={TextField}
                  sx={{ maxWidth: '500px' }}
                  fullWidth
                  name={`subtitle`}
                  label={
                    <FormattedMessage
                      id="site.subtitle"
                      defaultMessage="Site subtitle"
                    />
                  }
                  inputRef={ref}
                  InputProps={{
                    endAdornment: inputAdornment('end'),
                  }}
                />
              )}
            </CompletationProvider>

            <Box>
              <Typography>
                <FormattedMessage
                  id={'description'}
                  defaultMessage={'Description'}
                />
              </Typography>
            </Box>

            <DKMDEditor
              value={values.description}
              setValue={(val) => setFieldValue('description', val)}
            ></DKMDEditor>

            <FormControl sx={{ m: 1 }}>
              <InputLabel id="networks-multiple-label">
                <FormattedMessage id="networks" defaultMessage="Networks" />
              </InputLabel>
              <Select
                labelId="networks-multiple-label"
                id="networks-multiple-name"
                multiple
                value={values.chainIds || []}
                onChange={handleChange}
                renderValue={renderValue}
                input={
                  <OutlinedInput
                    label={
                      <FormattedMessage
                        id="networks"
                        defaultMessage="Networks"
                      />
                    }
                  />
                }
                MenuProps={MenuProps}
              >
                {EVM_CHAINS.map((chain) => (
                  <MenuItem key={chain.name} value={chain.chainId}>
                    <Checkbox
                      checked={
                        values?.chainIds &&
                        values?.chainIds.length > 0 &&
                        values?.chainIds.indexOf(chain?.chainId) > -1
                      }
                    />
                    <ListItemText primary={chain.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="usecases-multiple-label">
                <FormattedMessage id="usecases" defaultMessage="Use cases" />
              </InputLabel>
              <Select
                labelId="usecases-multiple-label"
                id="usecases-multiple-name"
                multiple
                value={values.usecases || []}
                onChange={handleChangeUsecase}
                renderValue={(selected) => selected.join(',')}
                input={
                  <OutlinedInput
                    label={
                      <FormattedMessage
                        id="usecases"
                        defaultMessage="Use cases"
                      />
                    }
                  />
                }
                MenuProps={MenuProps}
              >
                {UseCases.map((usecase) => (
                  <MenuItem key={usecase} value={usecase}>
                    <Checkbox
                      checked={
                        values?.usecases &&
                        values?.usecases.length > 0 &&
                        values?.usecases.indexOf(usecase) > -1
                      }
                    />
                    <ListItemText primary={usecase} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
