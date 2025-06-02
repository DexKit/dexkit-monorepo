import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import * as Yup from 'yup';

import { NETWORKS } from '@dexkit/core/constants/networks';
import { Network } from '@dexkit/core/types';
import { useActiveChainIds } from '@dexkit/ui';
import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';

import { getNetworks } from '@dexkit/core/utils/blockchain';
import { ipfsUriToUrl } from '@dexkit/core/utils/ipfs';
import {
  AssetItemType,
  CollectionItemType,
  SectionItem,
} from '@dexkit/ui/modules/wizard/types/config';
import { CollectionItemAutocomplete } from './CollectionItemAutocomplete';

function a11yProps(index: number) {
  return {
    id: `collection-tab-${index}`,
    'aria-controls': `collection-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  if (value === index) {
    return <>{children || null} </>;
  } else {
    return null;
  }
}

const AssetFormSchema: Yup.SchemaOf<Omit<AssetItemType, 'type'>> =
  Yup.object().shape({
    chainId: Yup.number().required(),
    contractAddress: Yup.string()
      .test('address', (value) => {
        return value !== undefined ? isAddress(value) : true;
      })
      .required(),
    title: Yup.string().required(),
    tokenId: Yup.string().required(),
  });

const CollectionFormSchema: Yup.SchemaOf<Omit<CollectionItemType, 'type'>> =
  Yup.object().shape({
    chainId: Yup.number().required(),
    contractAddress: Yup.string()
      .test('address', (value) => {
        return value !== undefined ? isAddress(value) : true;
      })
      .required(),
    backgroundImageUrl: Yup.string().required(),
    featured: Yup.bool().required(),
    subtitle: Yup.string().required(),
    title: Yup.string().required(),
    variant: Yup.mixed().required(),
  });

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(40),
}));

const CustomImageIcon = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(40),
}));

interface Props {
  onCancel: () => void;
  onSubmit: (item: SectionItem) => void;
  item?: SectionItem;
}

export default function AddItemForm({ item, onCancel, onSubmit }: Props) {
  const { activeChainIds } = useActiveChainIds();
  const [itemType, setItemType] = useState<string>(item ? item.type : 'asset');
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [value, setValue] = useState(0);

  const handleSubmitAsset = (
    values: AssetItemType,
    helpers: FormikHelpers<AssetItemType>,
  ) => {
    onSubmit(values);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmitCollection = (
    values: CollectionItemType,
    helpers: FormikHelpers<CollectionItemType>,
  ) => {
    onSubmit(values);
  };

  const assetForm = useFormik<AssetItemType>({
    initialValues:
      item?.type === 'asset'
        ? {
            type: 'asset',
            chainId: item.chainId,
            contractAddress: item.contractAddress,
            title: item.title,
            tokenId: item.tokenId,
          }
        : {
            type: 'asset',
            chainId: 1,
            contractAddress: '',
            title: '',
            tokenId: '',
          },
    validateOnChange: true,
    validationSchema: AssetFormSchema,
    onSubmit: handleSubmitAsset,
  });

  const collectionForm = useFormik<CollectionItemType>({
    initialValues:
      item?.type === 'collection'
        ? {
            type: 'collection',
            backgroundImageUrl: item.backgroundImageUrl,
            chainId: item.chainId,
            contractAddress: item.contractAddress,
            subtitle: item.subtitle,
            title: item.title,
            featured: item.featured || false,
            variant: item.variant,
          }
        : {
            type: 'collection',
            backgroundImageUrl: '',
            chainId: 1,
            contractAddress: '',
            subtitle: '',
            title: '',
            featured: false,
            variant: 'default',
          },
    validationSchema: CollectionFormSchema,
    validateOnChange: true,
    onSubmit: handleSubmitCollection,
  });

  const handleClickSubmit = () => {
    if (itemType === 'asset') {
      assetForm.submitForm();
    } else {
      collectionForm.submitForm();
    }
  };

  const handleCompleteCollection = (coll: any) => {
    collectionForm.setFieldValue('chainId', coll.chainId);
    collectionForm.setFieldValue('backgroundImageUrl', coll.backgroundImage);
    collectionForm.setFieldValue('contractAddress', coll.contractAddress);
  };

  const handleCompleteCollectionAsset = (coll: any) => {
    assetForm.setFieldValue('chainId', coll.chainId);
    assetForm.setFieldValue('contractAddress', coll.contractAddress);
  };

  const handleChangeFeatured = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    collectionForm.setFieldValue('featured', checked);
  };

  const handleChangeType = (e: SelectChangeEvent<string>) => {
    setItemType(e.target.value);
    assetForm.resetForm();
    collectionForm.resetForm();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth required>
          <InputLabel>
            <FormattedMessage id="item.type" defaultMessage="Item Type" />
          </InputLabel>
          <Select
            required
            label={
              <FormattedMessage id="item.type" defaultMessage="Item Type" />
            }
            fullWidth
            name="type"
            value={itemType}
            onChange={handleChangeType}
          >
            <MenuItem value="asset">
              <FormattedMessage id="asset" defaultMessage="Asset" />
            </MenuItem>
            <MenuItem value="collection">
              <FormattedMessage id="collection" defaultMessage="Collection" />
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {itemType === 'asset' ? (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="collection tabs"
          >
            <Tab label="Import" {...a11yProps(0)} />
            <Tab label="Your collections" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={1}>
            <Grid item xs={12}>
              <CollectionItemAutocomplete
                onChange={(coll) => handleCompleteCollectionAsset(coll)}
                value={assetForm.values}
              />
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={0}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  fullWidth
                  value={assetForm.values.chainId}
                  onChange={assetForm.handleChange}
                  name="chainId"
                  renderValue={(value) => {
                    return (
                      <Stack
                        direction="row"
                        alignItems="center"
                        alignContent="center"
                        spacing={1}
                      >
                        <Avatar
                          src={ipfsUriToUrl(
                            NETWORKS[assetForm.values.chainId]?.imageUrl || '',
                          )}
                          style={{ width: 'auto', height: '1rem' }}
                        />
                        <Typography variant="body1">
                          {NETWORKS[assetForm.values.chainId]?.name}
                        </Typography>
                      </Stack>
                    );
                  }}
                >
                  {getNetworks({ includeTestnet: true })
                    .filter((n) => activeChainIds.includes(n.chainId))
                    .map((network: Network, index: number) => (
                      <MenuItem key={index} value={network?.chainId}>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: (theme) => theme.spacing(4),
                              display: 'flex',
                              alignItems: 'center',
                              alignContent: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Avatar
                              src={ipfsUriToUrl(network?.imageUrl || '')}
                              sx={{
                                width: 'auto',
                                height: '1rem',
                              }}
                            />
                          </Box>
                        </ListItemIcon>
                        <ListItemText primary={network?.name} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={
                  <FormattedMessage
                    id="contract.address"
                    defaultMessage="Contract address"
                  />
                }
                fullWidth
                value={assetForm.values.contractAddress}
                name="contractAddress"
                onChange={assetForm.handleChange}
                required
                error={Boolean(assetForm.errors.contractAddress)}
                helperText={
                  Boolean(assetForm.errors.contractAddress)
                    ? assetForm.errors.contractAddress
                    : undefined
                }
              />
            </Grid>
          </TabPanel>
          <Grid item xs={12}>
            <TextField
              label={
                <FormattedMessage id="token.id" defaultMessage="Token ID" />
              }
              required
              fullWidth
              value={assetForm.values.tokenId}
              name="tokenId"
              onChange={assetForm.handleChange}
              error={Boolean(assetForm.errors.tokenId)}
              helperText={
                Boolean(assetForm.errors.tokenId)
                  ? assetForm.errors.tokenId
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12}>
            <CompletationProvider
              onCompletation={(output: string) => {
                assetForm.setFieldValue('title', output);
              }}
              initialPrompt={assetForm.values.title}
            >
              {({ inputAdornment, ref }) => (
                <TextField
                  label={<FormattedMessage id="title" defaultMessage="Title" />}
                  fullWidth
                  required
                  value={assetForm.values.title}
                  name="title"
                  onChange={assetForm.handleChange}
                  error={Boolean(assetForm.errors.title)}
                  helperText={
                    Boolean(assetForm.errors.title)
                      ? assetForm.errors.title
                      : undefined
                  }
                  inputRef={ref}
                  InputProps={{ endAdornment: inputAdornment('end') }}
                />
              )}
            </CompletationProvider>
          </Grid>
        </>
      ) : (
        <>
          <MediaDialog
            dialogProps={{
              open: openMediaDialog,
              maxWidth: 'lg',
              fullWidth: true,
              onClose: () => {
                setOpenMediaDialog(false);
              },
            }}
            onConfirmSelectFile={(file) => {
              if (file) {
                collectionForm.setFieldValue('backgroundImageUrl', file.url);
              }

              setOpenMediaDialog(false);
            }}
          />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="collection tabs"
          >
            <Tab label="Import" {...a11yProps(0)} />
            <Tab label="Your collections" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={1}>
            <Grid item xs={12}>
              <CollectionItemAutocomplete
                onChange={(coll) => handleCompleteCollection(coll)}
                value={collectionForm.values}
              />
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={0}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  fullWidth
                  value={collectionForm.values.chainId}
                  onChange={collectionForm.handleChange}
                  name="chainId"
                  renderValue={(value) => {
                    return (
                      <Stack
                        direction="row"
                        alignItems="center"
                        alignContent="center"
                        spacing={1}
                      >
                        <Avatar
                          src={ipfsUriToUrl(
                            NETWORKS[collectionForm.values.chainId]?.imageUrl ||
                              '',
                          )}
                          style={{ width: 'auto', height: '1rem' }}
                        />
                        <Typography variant="body1">
                          {NETWORKS[collectionForm.values.chainId]?.name}
                        </Typography>
                      </Stack>
                    );
                  }}
                >
                  {getNetworks({ includeTestnet: false }).map(
                    (network: Network, index: number) => (
                      <MenuItem key={index} value={network.chainId}>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: (theme) => theme.spacing(4),
                              display: 'flex',
                              alignItems: 'center',
                              alignContent: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Avatar
                              src={ipfsUriToUrl(network?.imageUrl || '')}
                              sx={{
                                width: 'auto',
                                height: '1rem',
                              }}
                            />
                          </Box>
                        </ListItemIcon>
                        <ListItemText primary={network.name} />
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={
                  <FormattedMessage
                    id="contract.address"
                    defaultMessage="Contract address"
                  />
                }
                required
                fullWidth
                value={collectionForm.values.contractAddress}
                name="contractAddress"
                onChange={collectionForm.handleChange}
                error={Boolean(collectionForm.errors.contractAddress)}
                helperText={
                  Boolean(collectionForm.errors.contractAddress)
                    ? collectionForm.errors.contractAddress
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <FormattedMessage
                  id="background.image"
                  defaultMessage="Background image"
                />
              </Typography>
              <Button onClick={() => setOpenMediaDialog(true)}>
                {collectionForm.values.backgroundImageUrl ? (
                  <CustomImage src={collectionForm.values.backgroundImageUrl} />
                ) : (
                  <CustomImageIcon />
                )}
              </Button>
            </Grid>
          </TabPanel>
          <Grid item xs={12}>
            <CompletationProvider
              onCompletation={(output: string) => {
                collectionForm.setFieldValue('title', output);
              }}
              initialPrompt={collectionForm.values.title}
            >
              {({ inputAdornment, ref }) => (
                <TextField
                  label={<FormattedMessage id="title" defaultMessage="Title" />}
                  fullWidth
                  required
                  value={collectionForm.values.title}
                  name="title"
                  onChange={collectionForm.handleChange}
                  error={Boolean(collectionForm.errors.title)}
                  helperText={
                    Boolean(collectionForm.errors.title)
                      ? collectionForm.errors.title
                      : undefined
                  }
                  inputRef={ref}
                  InputProps={{ endAdornment: inputAdornment('end') }}
                />
              )}
            </CompletationProvider>
          </Grid>
          <Grid item xs={12}>
            <CompletationProvider
              onCompletation={(output: string) => {
                collectionForm.setFieldValue('subtitle', output);
              }}
              initialPrompt={collectionForm.values.subtitle}
            >
              {({ inputAdornment, ref }) => (
                <TextField
                  label={
                    <FormattedMessage id="subtitle" defaultMessage="Subtitle" />
                  }
                  required
                  fullWidth
                  value={collectionForm.values.subtitle}
                  onChange={collectionForm.handleChange}
                  name="subtitle"
                  error={Boolean(collectionForm.errors.subtitle)}
                  helperText={
                    Boolean(collectionForm.errors.subtitle)
                      ? collectionForm.errors.subtitle
                      : undefined
                  }
                  inputRef={ref}
                  InputProps={{ endAdornment: inputAdornment('end') }}
                />
              )}
            </CompletationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage id="variant" defaultMessage="Variant" />
              </InputLabel>
              <Select
                fullWidth
                value={collectionForm.values.variant}
                onChange={collectionForm.handleChange}
                name="variant"
                label={
                  <FormattedMessage id="variant" defaultMessage="Variant" />
                }
              >
                <MenuItem value="default">
                  <FormattedMessage id="default" defaultMessage="Default" />
                </MenuItem>
                <MenuItem value="simple">
                  <FormattedMessage id="simple" defaultMessage="Simple" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              label={
                <FormattedMessage id="featured" defaultMessage="Featured" />
              }
              control={
                <Checkbox
                  checked={collectionForm.values.featured}
                  name="featured"
                  onChange={handleChangeFeatured}
                />
              }
            />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            disabled={
              (!assetForm.isValid && itemType === 'asset') ||
              (!collectionForm.isValid && itemType === 'collection')
            }
            variant="contained"
            onClick={handleClickSubmit}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
          <Button onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
