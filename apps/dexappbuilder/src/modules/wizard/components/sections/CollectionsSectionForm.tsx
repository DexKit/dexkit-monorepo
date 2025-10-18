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
  [theme.breakpoints.down('sm')]: {
    height: theme.spacing(15),
    width: theme.spacing(30),
  },
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
  isMobile?: boolean;
}

export default function CollectionsSectionForm({
  onSubmit,
  onCancel,
  initialValues,
  isMobile,
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
      <Grid container spacing={isMobile ? 1.5 : 2}>
        <Grid size={12}>
          <FormControl required fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel sx={{ fontSize: isMobile ? "0.875rem" : undefined }}>
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
              sx={{ fontSize: isMobile ? "0.875rem" : undefined }}
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
                    style={{ width: 'auto', height: isMobile ? '0.75rem' : '1rem' }}
                  />
                  <Typography variant={isMobile ? "body2" : "body1"}>
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
                    sx={{ fontSize: isMobile ? "0.875rem" : undefined }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: (theme) => theme.spacing(isMobile ? 4 : 6),
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
                            height: theme.spacing(isMobile ? 3 : 4),
                          })}
                          alt={(NETWORKS[key] as Network).name}
                        />
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={(NETWORKS[key] as Network).name}
                      secondary={(NETWORKS[key] as Network).symbol}
                      slotProps={{
                        primary: {
                          fontSize: isMobile ? "0.875rem" : undefined
                        },
                        secondary: {
                          fontSize: isMobile ? "0.75rem" : undefined
                        }
                      }}
                    />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
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
            size={isMobile ? "small" : "medium"}
            InputProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
            FormHelperTextProps={{
              style: {
                fontSize: isMobile ? '0.75rem' : undefined,
              }
            }}
          />
        </Grid>
        <Grid size={12}>
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
            size={isMobile ? "small" : "medium"}
            InputProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
            FormHelperTextProps={{
              style: {
                fontSize: isMobile ? '0.75rem' : undefined,
              }
            }}
          />
        </Grid>

        <Grid size={12}>
          <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 1 }}>
            <FormattedMessage
              id="collection.image"
              defaultMessage="Collection image"
            />
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <Button
              onClick={() => {
                setOpenMediaDialog(true);
                setMediaFieldToEdit('imageUrl');
              }}
              size={isMobile ? "small" : "medium"}
              sx={{ p: 0 }}
            >
              <CustomImage src={formik.values.imageUrl} />
            </Button>
          </Box>
        </Grid>
        <Grid size={12}>
          <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 1 }}>
            <FormattedMessage
              id="background.image"
              defaultMessage="Background image"
            />
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <Button
              onClick={() => {
                setOpenMediaDialog(true);
                setMediaFieldToEdit('backgroundUrl');
              }}
              size={isMobile ? "small" : "medium"}
              sx={{ p: 0 }}
            >
              <CustomImage src={formik.values.backgroundUrl} />
            </Button>
          </Box>
        </Grid>
        <Grid size={12}>
          <TextField
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            fullWidth
            label={
              <FormattedMessage
                id="description"
                defaultMessage="Description"
              />
            }
            multiline
            rows={isMobile ? 3 : 4}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            name="uri"
            onChange={formik.handleChange}
            value={formik.values.uri}
            fullWidth
            label={<FormattedMessage id="uri" defaultMessage="URI" />}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: isMobile ? '0.875rem' : undefined,
              }
            }}
          />
        </Grid>
        <Grid size={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.disableSecondarySells}
                onChange={(e: any) => {
                  formik.setFieldValue(
                    'disableSecondarySells',
                    e.target.checked,
                  );
                }}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            }
            label={
              <Typography variant={isMobile ? "body2" : "body1"}>
                <FormattedMessage
                  id="disable.secondary.sells"
                  defaultMessage="Disable secondary sells"
                />
              </Typography>
            }
          />
        </Grid>
        <Grid size={12}>
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button
              disabled={!formik.isValid}
              type="submit"
              variant="contained"
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: isMobile ? "0.875rem" : undefined,
                py: isMobile ? 0.75 : undefined,
              }}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
            <Button
              onClick={onCancel}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: isMobile ? "0.875rem" : undefined,
              }}
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
