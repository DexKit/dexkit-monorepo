import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { CollectionItemAutocomplete } from '../forms/CollectionItemAutocomplete';

import * as Yup from 'yup';

import { Grid, LinearProgress } from '@mui/material';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';

import { ImageFormUpload } from '@/modules/contract-wizard/components/ImageFormUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAllTokenList } from 'src/hooks/blockchain';

import { Token } from 'src/types/blockchain';

import { getGatedConditionsText } from '../../services';

import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { getAssetProtocol } from '@dexkit/ui/modules/nft/services';
import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import { GatedCondition } from '@dexkit/ui/modules/wizard/types/config';
import { SearchTokenAutocomplete } from '../forms/SearchTokenAutocomplete';

const PreviewGatedConditionsDialog = dynamic(
  () => import('./PreviewGatedConditionsDialog'),
);
const GatedCoditionsSchema = Yup.array(
  Yup.object().shape({
    type: Yup.string().required(),
    condition: Yup.string(),
    address: Yup.string().required(),
    chainId: Yup.number(),
    decimals: Yup.number(),
    protocol: Yup.string(),
    tokenId: Yup.string(),
    amount: Yup.string().required(),
  }),
);

const GatedPageScheme = Yup.object().shape({
  layout: Yup.object().shape({
    frontImage: Yup.string(),
    accessRequirementsMessage: Yup.string(),
    fronImageHeight: Yup.number(),
    fronImageWidth: Yup.number(),
  }),
  conditions: GatedCoditionsSchema,
});

interface Props {
  onCancel?: () => void;
  onSubmit?: (conditions: GatedCondition[], layout: GatedPageLayout) => void;
  conditions?: GatedCondition[];
  gatedPageLayout?: GatedPageLayout;
  dialogProps: DialogProps;
}

export default function GatedConditionsFormDialog({
  onCancel,
  onSubmit,
  dialogProps,
  conditions,
  gatedPageLayout,
}: Props) {
  const { onClose } = dialogProps;
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const [value, setValue] = useState('1');

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(false);

  const featuredTokens = useAllTokenList({
    includeNative: true,
    isWizardConfig: true,
  });

  const [selectedCoins, setSelectedCoins] = useState<{ [key: number]: Token }>(
    {},
  );
  const [selectedCollections, setSelectedCollections] = useState<{
    [key: number]: any;
  }>({});
  useEffect(() => {
    if (conditions) {
      for (let index = 0; index < conditions.length; index++) {
        let condition = conditions[index];
        if (condition.type === 'coin') {
          let findToken = featuredTokens.find(
            (t) =>
              t.address === condition.address &&
              t.chainId === condition.chainId,
          );
          if (findToken) {
            selectedCoins[index] = findToken;
          }
        }
        if (condition.type === 'collection') {
          selectedCollections[index] = {
            contractAddress: condition.address,
            chainId: condition.chainId,
          };
        }
      }
      setSelectedCoins({ ...selectedCoins });
      setSelectedCollections({ ...selectedCollections });
    }
  }, [conditions, featuredTokens]);

  return (
    <>
      <Dialog {...dialogProps}>
        <AppDialogTitle
          title={
            <FormattedMessage
              id="add.gated.conditions"
              defaultMessage="Add gated conditions"
            />
          }
          onClose={handleClose}
        />
        <TabContext value={value}>
          <Formik
            onSubmit={(values) => {
              if (values && onSubmit) {
                onSubmit(values.conditions, values.layout);
              }
              handleClose();
            }}
            initialValues={{
              layout: {
                accessRequirementsMessage:
                  gatedPageLayout?.accessRequirementsMessage || '',
                frontImage: gatedPageLayout?.frontImage || '',
                frontImageHeight: gatedPageLayout?.frontImageHeight,
                frontImageWidth: gatedPageLayout?.frontImageWidth,
              },
              conditions:
                conditions ||
                ([
                  {
                    type: 'collection',
                    amount: '1',
                  },
                ] as GatedCondition[]),
            }}
            validationSchema={GatedPageScheme}
          >
            {({
              submitForm,
              isSubmitting,
              isValid,
              values,
              setFieldValue,
              errors,
            }) => (
              <Form>
                {false && (
                  <Alert role="info">
                    {getGatedConditionsText({ conditions: values.conditions })}
                  </Alert>
                )}
                {open && (
                  <PreviewGatedConditionsDialog
                    dialogProps={{
                      open,
                      onClose: () => setOpen(false),
                      fullWidth: true,
                      maxWidth: 'xl',
                    }}
                    conditions={values.conditions}
                    gatedPageLayout={values.layout}
                  />
                )}

                <Alert severity="info">
                  <AlertTitle>
                    <FormattedMessage
                      id="info.alert.title.gated.form.modal"
                      defaultMessage="Define access conditions for your private page"
                    />
                  </AlertTitle>
                  <FormattedMessage
                    id="info.alert.description.gated.form.modal"
                    defaultMessage="As the owner of this private web page, please enter the specific conditions that users must meet to access your page. By defining these conditions, you ensure that only eligible users are granted access."
                  />
                </Alert>
                <Box sx={{ p: 2 }}>
                  <Button variant="contained" onClick={() => setOpen(true)}>
                    <FormattedMessage
                      id={'preview'}
                      defaultMessage={'Preview'}
                    ></FormattedMessage>
                  </Button>
                </Box>

                <DialogContent dividers>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Conditions" value="1" />
                      <Tab label="Layout" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <FieldArray
                      name="conditions"
                      render={(arrayHelpers) => (
                        <Box sx={{ p: 2 }}>
                          {values.conditions.map((condition, index) => (
                            <Box sx={{ p: 2 }} key={index}>
                              <Grid container spacing={4} key={index}>
                                {index !== 0 && (
                                  <Grid item xs={12}>
                                    <Divider />
                                  </Grid>
                                )}
                                {index !== 0 && (
                                  <Grid item xs={12}>
                                    <FormControl fullWidth variant="filled">
                                      <InputLabel shrink>
                                        <FormattedMessage
                                          id="condition"
                                          defaultMessage="Condition"
                                        />
                                      </InputLabel>
                                      <Field
                                        component={Select}
                                        name={`conditions[${index}].condition`}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        fullWidth
                                        variant="filled"
                                      >
                                        <MenuItem value="or">
                                          <FormattedMessage
                                            id="or"
                                            defaultMessage="Or"
                                          />
                                        </MenuItem>

                                        <MenuItem value="and">
                                          <FormattedMessage
                                            id="and"
                                            defaultMessage="And"
                                          />
                                        </MenuItem>
                                      </Field>
                                    </FormControl>
                                  </Grid>
                                )}
                                <Grid item xs={12}>
                                  <Stack
                                    direction="row"
                                    justifyContent={'space-between'}
                                    alignItems="center"
                                  >
                                    <Typography align="left">
                                      <b>
                                        <FormattedMessage
                                          id="condition.index.value"
                                          defaultMessage="Condition {index}"
                                          values={{
                                            index: index + 1,
                                          }}
                                        />
                                      </b>
                                    </Typography>
                                    <Fab
                                      variant="extended"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      <DeleteIcon />
                                    </Fab>
                                  </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                  <FormControl fullWidth>
                                    <InputLabel shrink>
                                      <FormattedMessage
                                        id="type"
                                        defaultMessage="Type"
                                      />
                                    </InputLabel>
                                    <Field
                                      component={Select}
                                      name={`conditions[${index}].type`}
                                      label={
                                        <FormattedMessage
                                          id="type"
                                          defaultMessage="Type"
                                        />
                                      }
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      fullWidth
                                    >
                                      <MenuItem value="collection">
                                        <FormattedMessage
                                          id="collection"
                                          defaultMessage="Collection"
                                        />
                                      </MenuItem>

                                      <MenuItem value="coin">
                                        <FormattedMessage
                                          id="coin"
                                          defaultMessage="Coin"
                                        />
                                      </MenuItem>
                                    </Field>
                                  </FormControl>
                                </Grid>
                                {condition?.type === 'collection' && (
                                  <Grid item xs={12}>
                                    <CollectionItemAutocomplete
                                      onChange={(coll: any) => {
                                        selectedCollections[index] = coll;
                                        setSelectedCollections({
                                          ...selectedCollections,
                                          //@ts-ignore
                                          address: coll?.contractAddress,
                                        });
                                        setFieldValue(
                                          `conditions[${index}].address`,
                                          coll.contractAddress,
                                        );
                                        setFieldValue(
                                          `conditions[${index}].chainId`,
                                          coll.chainId,
                                        );
                                        setFieldValue(
                                          `conditions[${index}].symbol`,
                                          coll.name,
                                        );
                                        // We identify protocol to then check if we need to add token Id
                                        getAssetProtocol(
                                          getProviderByChainId(coll.chainId),
                                          coll.contractAddress,
                                        ).then((v) => {
                                          setFieldValue(
                                            `conditions[${index}].protocol`,
                                            v,
                                          );
                                          selectedCollections[index].protocol =
                                            v;
                                          setSelectedCollections({
                                            ...selectedCollections,
                                          });
                                        });
                                      }}
                                      value={selectedCollections[index]}
                                    />
                                  </Grid>
                                )}
                                {condition?.type === 'coin' && (
                                  <Grid item xs={12}>
                                    <SearchTokenAutocomplete
                                      label="Search coin"
                                      tokens={featuredTokens}
                                      data={selectedCoins[index]}
                                      onChange={(tk: any) => {
                                        selectedCoins[index] = tk;
                                        setSelectedCoins({ ...selectedCoins });
                                        setFieldValue(
                                          `conditions[${index}].address`,
                                          tk?.address,
                                        );
                                        setFieldValue(
                                          `conditions[${index}].symbol`,
                                          tk?.symbol,
                                        );
                                        setFieldValue(
                                          `conditions[${index}].chainId`,
                                          tk?.chainId,
                                        );
                                        setFieldValue(
                                          `conditions[${index}].decimals`,
                                          tk?.decimals,
                                        );
                                        setFieldValue(
                                          `conditions[${index}].protocol`,
                                          undefined,
                                        );
                                      }}
                                    />
                                  </Grid>
                                )}

                                {condition?.protocol === 'ERC1155' && (
                                  <Grid item xs={12}>
                                    <Field
                                      component={TextField}
                                      name={`conditions[${index}].tokenId`}
                                      label={
                                        <FormattedMessage
                                          id="token.id"
                                          defaultMessage="token.id"
                                        />
                                      }
                                      fullWidth
                                    />
                                  </Grid>
                                )}

                                <Grid item xs={12}>
                                  <Field
                                    component={TextField}
                                    name={`conditions[${index}].amount`}
                                    label={
                                      <FormattedMessage
                                        id="must.have"
                                        defaultMessage="Must have"
                                      />
                                    }
                                    fullWidth
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          ))}

                          <Box
                            sx={{ p: 2 }}
                            display={'flex'}
                            justifyContent={'flex-end'}
                          >
                            <Button
                              variant="contained"
                              onClick={() =>
                                arrayHelpers.push({
                                  type: 'collection',
                                  amount: 1,
                                  condition: 'or',
                                })
                              }
                            >
                              <FormattedMessage
                                id="add.condition"
                                defaultMessage="Add condition"
                              />
                            </Button>
                          </Box>
                        </Box>
                      )}
                    />
                  </TabPanel>
                  <TabPanel value="2">
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Field
                          component={TextField}
                          type="text"
                          fullWidth
                          label={
                            <FormattedMessage
                              id={'access.requirements.message'}
                              defaultMessage={'Access requirements message'}
                            />
                          }
                          name="layout.accessRequirementsMessage"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={2}>
                          <Box pl={2}>
                            <Typography variant="caption">
                              <FormattedMessage
                                id="front.image"
                                defaultMessage="Front Image"
                              />
                            </Typography>
                          </Box>
                          <ImageFormUpload
                            value={values?.layout?.frontImage || ''}
                            onSelectFile={(file) =>
                              setFieldValue(`layout.frontImage`, file)
                            }
                            error={Boolean(
                              errors && (errors as any)?.layout?.frontImage,
                            )}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack
                          direction={'row'}
                          spacing={2}
                          alignContent={'center'}
                          alignItems={'center'}
                          sx={{ pt: 3 }}
                        >
                          <Typography variant="body2" sx={{ width: '130px' }}>
                            <FormattedMessage
                              id="front.image.size"
                              defaultMessage="Front image size"
                            />
                          </Typography>
                          <Field
                            component={TextField}
                            type="number"
                            sx={{ maxWidth: '150px' }}
                            fullWidth
                            label={
                              <FormattedMessage
                                id={'width.px'}
                                defaultMessage={'width (px)'}
                              />
                            }
                            name="layout.frontImageWidth"
                          />

                          <Typography color={'primary'}>x</Typography>
                          <Field
                            component={TextField}
                            type="number"
                            sx={{ maxWidth: '150px' }}
                            fullWidth
                            label={
                              <FormattedMessage
                                id={'height.px'}
                                defaultMessage={'height (px)'}
                              />
                            }
                            name="layout.frontImageHeight"
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </TabPanel>
                </DialogContent>
                <DialogActions>
                  {isSubmitting && <LinearProgress />}
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      disabled={!isValid || isSubmitting}
                      variant="contained"
                      onClick={submitForm}
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                    <Button onClick={onCancel}>
                      <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    </Button>
                  </Stack>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </TabContext>
      </Dialog>
    </>
  );
}
