import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';
import { NETWORKS } from '../../../../constants/chain';

import { FormikHelpers, useFormik } from 'formik';

import { Network } from '@dexkit/core/types';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { ipfsUriToUrl } from '@dexkit/core/utils/ipfs';
import { useActiveChainIds } from '@dexkit/ui';
import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import * as Yup from 'yup';

export interface Form {
  chainId: number;
  contractAddress: string;
  name: string;
  backgroundUrl: string;
  imageUrl: string;
  description?: string;
  uri?: string;
  disableSecondarySells?: boolean;
}

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(40),
}));

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  chainId: Yup.number().required(),
  contractAddress: Yup.string()
    .test('address', (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
  backgroundUrl: Yup.string().required(),
  imageUrl: Yup.string().required(),
  name: Yup.string().required(),
  description: Yup.string().notRequired(),
  uri: Yup.string().notRequired(),
  disableSecondarySells: Yup.boolean(),
});

interface Props {
  onSubmit?: (form: Form) => void;
  onCancel?: () => void;
  initialValues?: Form;
}

export default function CollectionsSectionForm({
  onSubmit,
  onCancel,
  initialValues,
}: Props) {
  const { activeChainIds } = useActiveChainIds();

  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const formik = useFormik<Form>({
    initialValues: initialValues
      ? initialValues
      : {
          chainId: 1,
          contractAddress: '',
          name: '',
          backgroundUrl: '',
          description: '',
          imageUrl: '',
          disableSecondarySells: false,
        },
    validationSchema: FormSchema,
    validateOnChange: true,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <MediaDialog
        dialogProps={{
          open: openMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => {
            setOpenMediaDialog(false);
            setMediaFieldToEdit(undefined);
          },
        }}
        onConfirmSelectFile={(file) => {
          if (mediaFieldToEdit && file) {
            formik.setFieldValue(mediaFieldToEdit, file.url);
          }
          setMediaFieldToEdit(undefined);
          setOpenMediaDialog(false);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl required fullWidth>
            <InputLabel>
              <FormattedMessage id="chainId" defaultMessage="Chain ID" />
            </InputLabel>
            <Select
              required
              label={
                <FormattedMessage id="chainId" defaultMessage="Chain ID" />
              }
              error={Boolean(formik.errors.chainId)}
              onChange={formik.handleChange}
              value={formik.values.chainId}
              fullWidth
              name="chainId"
              renderValue={(params) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  spacing={1}
                >
                  <Avatar
                    src={ipfsUriToUrl(
                      NETWORKS[formik.values.chainId].imageUrl || '',
                    )}
                    style={{ width: 'auto', height: '1rem' }}
                  />
                  <Typography variant="body1">
                    {NETWORKS[formik.values.chainId].name}
                  </Typography>
                </Stack>
              )}
            >
              {Object.keys(NETWORKS)
                .filter((k) => activeChainIds.includes(Number(k)))
                .map((key: any, index: number) => (
                  <MenuItem
                    key={index}
                    value={(NETWORKS[key] as Network).chainId}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: (theme) => theme.spacing(6),
                          display: 'flex',
                          alignItems: 'center',
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Avatar
                          src={(NETWORKS[key] as Network).imageUrl}
                          sx={(theme) => ({
                            width: 'auto',
                            height: theme.spacing(4),
                          })}
                          alt={(NETWORKS[key] as Network).name}
                        />
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={(NETWORKS[key] as Network).name}
                      secondary={(NETWORKS[key] as Network).symbol}
                    />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="contractAddress"
            onChange={formik.handleChange}
            value={formik.values.contractAddress}
            fullWidth
            label={
              <FormattedMessage
                id="contract.address"
                defaultMessage="Contract address"
              />
            }
            error={Boolean(formik.errors.contractAddress)}
            helperText={
              Boolean(formik.errors.contractAddress)
                ? formik.errors.contractAddress
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            fullWidth
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            error={Boolean(formik.errors.name)}
            helperText={
              Boolean(formik.errors.name) ? formik.errors.name : undefined
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2">
            <FormattedMessage
              id="collection.image"
              defaultMessage="Collection image"
            />
          </Typography>
          <Button
            onClick={() => {
              setOpenMediaDialog(true);
              setMediaFieldToEdit('imageUrl');
            }}
          >
            <CustomImage src={formik.values.imageUrl} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            <FormattedMessage
              id="collection.background.image"
              defaultMessage="Collection background image"
            />
          </Typography>
          <Button
            onClick={() => {
              setOpenMediaDialog(true);
              setMediaFieldToEdit('backgroundUrl');
            }}
          >
            <CustomImage src={formik.values.backgroundUrl} />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <CompletationProvider
            onCompletation={(output) =>
              formik.setFieldValue('description', output)
            }
            initialPrompt={formik.values.description}
            multiline
          >
            {({ inputAdornment, ref }) => (
              <TextField
                multiline
                rows={3}
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                fullWidth
                type="url"
                label={
                  <FormattedMessage
                    id="description"
                    defaultMessage="Description"
                  />
                }
                inputRef={ref}
                error={Boolean(formik.errors.description)}
                helperText={
                  Boolean(formik.errors.description)
                    ? formik.errors.description
                    : undefined
                }
                InputProps={{
                  endAdornment: inputAdornment('end'),
                }}
              />
            )}
          </CompletationProvider>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.disableSecondarySells}
                onChange={() =>
                  formik.setFieldValue(
                    'disableSecondarySells',
                    !formik.values.disableSecondarySells,
                  )
                }
              />
            }
            label={
              <FormattedMessage
                id={'disable.secondary.sells'}
                defaultMessage={'Disable secondary sells'}
              ></FormattedMessage>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button
              disabled={!formik.isValid}
              type="submit"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
            <Button onClick={onCancel}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
