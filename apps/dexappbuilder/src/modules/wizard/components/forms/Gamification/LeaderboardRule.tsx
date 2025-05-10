import { GamificationPoint } from '@/modules/wizard/types';
import { AppRanking } from '@/modules/wizard/types/ranking';
import { UserEvents } from '@dexkit/core/constants/userEvents';
import { beautifyCamelCase } from '@dexkit/core/utils';
import { AppConfirmDialog } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Edit from '@mui/icons-material/Edit';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  AutocompleteChangeReason,
  Autocomplete as AutocompleteMUI,
  AutocompleteRenderInputParams,
  Box,
  Button,
  ButtonBase,
  Divider,
  FormControl,
  Grid,
  Stack,
  TextField as TextFieldMUI,
  Typography,
} from '@mui/material';
import { Field, FormikErrors, FormikTouched } from 'formik';
import { TextField } from 'formik-mui';
import { SyntheticEvent, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CollectionFilterForm from './Filters/CollectionFilterForm';
import DropCollectionFilterForm from './Filters/DropCollectionFilter';
import SwapFilterForm from './Filters/SwapFilterForm';

const userEvents = [
  {
    value: UserEvents.nftAcceptListERC1155,
    name: 'Accept ERC1155 NFT listing ',
  },
  {
    value: UserEvents.nftAcceptOfferERC1155,
    name: 'Accept ERC1155 NFT offer ',
  },
  {
    value: UserEvents.nftAcceptListERC721,
    name: 'Accept ERC721 NFT listing',
  },
  {
    value: UserEvents.nftAcceptOfferERC721,
    name: 'Accept ERC721 NFT offer',
  },
  {
    value: UserEvents.buyDropCollection,
    name: 'Buy NFT drop collection',
  },
  {
    value: UserEvents.buyDropEdition,
    name: 'Buy NFT drop edition',
  },
  {
    name: 'Sign login message',
    value: UserEvents.loginSignMessage,
  },
  {
    name: beautifyCamelCase(UserEvents.swap),
    value: UserEvents.swap,
  },
];

export interface LeaderboardRuleProps {
  index: number;
  setFieldValue: (field: string, value: any) => void;
  values: {
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  };
  touched: FormikTouched<{
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  }>;
  errors: FormikErrors<{
    from: string | undefined;
    to: string | undefined;
    settings: GamificationPoint[];
  }>;
  ranking: AppRanking;
  onRemove: () => void;
  isNew: boolean;
  onSave: () => void;
}

export default function LeaderboardRule({
  index,
  setFieldValue,
  values,
  touched,
  errors,
  ranking,
  onRemove,
  isNew,
  onSave,
}: LeaderboardRuleProps) {
  const renderFilter = (event?: string) => {
    switch (event) {
      case UserEvents.swap:
        return (
          <SwapFilterForm
            item={
              values?.settings[index]?.filter
                ? JSON.parse(values?.settings[index]?.filter as string)
                : undefined
            }
            onChange={(item) =>
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              )
            }
          />
        );
      case UserEvents.nftAcceptListERC721:
      case UserEvents.nftAcceptOfferERC721:
      case UserEvents.nftAcceptListERC1155:
      case UserEvents.nftAcceptOfferERC1155:
        return (
          <CollectionFilterForm
            item={
              values?.settings[index]?.filter
                ? JSON.parse(values?.settings[index]?.filter as string)
                : undefined
            }
            onChange={(item) =>
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              )
            }
            isERC1155={
              values.settings[index]?.userEventType ===
                UserEvents.nftAcceptOfferERC1155 ||
              values.settings[index]?.userEventType ===
                UserEvents.nftAcceptListERC1155
            }
          />
        );
      case UserEvents.buyDropCollection:
      case UserEvents.buyDropEdition:
        return (
          <DropCollectionFilterForm
            item={
              values?.settings[index]?.filter
                ? JSON.parse(values?.settings[index]?.filter as string)
                : undefined
            }
            index={index}
            onChange={(item) => {
              setFieldValue(
                `settings[${index}].filter`,
                item ? JSON.stringify(item) : undefined,
              );
            }}
            isERC1155={
              values.settings[index]?.userEventType ===
              UserEvents.buyDropEdition
            }
          />
        );
      default:
        break;
    }

    return null;
  };

  const { chainId } = useWeb3React();

  const [edit, setEdit] = useState(isNew);

  const [clearConfirm, setClearConfirm] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleConfirm = () => {
    setFieldValue(`settings[${index}]`, {
      ...values.settings[index],
      userEventType: newValue,
    });
    setClearConfirm(false);
    setNewValue('');
  };

  const handleClose = () => {
    setClearConfirm(false);
  };

  const [isEdit, setIsEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEdit = () => {
    setIsEdit(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleSave = () => {
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const { formatMessage } = useIntl();
  return (
    <>
      {clearConfirm && (
        <AppConfirmDialog
          DialogProps={{
            open: clearConfirm,
            onClose: handleClose,
            maxWidth: 'sm',
            fullWidth: true,
          }}
          title={
            <FormattedMessage
              id="clear.event.type"
              defaultMessage="Clear event type"
            />
          }
          onConfirm={handleConfirm}
        >
          <Stack spacing={1}>
            <Typography variant="body1">
              <FormattedMessage
                id="the.data.from.your.filter.parameters.will.be.lost"
                defaultMessage="The data from your filter parameters will be lost"
              />
            </Typography>
            <Typography variant="body2">
              <FormattedMessage
                id="are.you.sure.you.want.to.change.the.event.type"
                defaultMessage="Are you sure you want to change the event type?"
              />
            </Typography>
          </Stack>
        </AppConfirmDialog>
      )}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={2}>
              {isEdit ? (
                <Field
                  component={TextField}
                  name={`settings[${index}].title`}
                  inputRef={(ref: any) => (inputRef.current = ref)}
                  variant="standard"
                  placeholder={formatMessage({
                    id: 'rule.title',
                    defaultMessage: 'Rule title',
                  })}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                    if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                  onBlur={() => {
                    handleSave();
                  }}
                />
              ) : (
                <ButtonBase
                  sx={{
                    px: 1,
                    py: 0.25,

                    borderRadius: (theme) => theme.shape.borderRadius / 2,
                    '&: hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                  onClick={handleEdit}
                >
                  <Typography fontWeight="bold" variant="body1">
                    {values.settings[index]?.title ? (
                      values.settings[index].title
                    ) : (
                      <FormattedMessage
                        id="rule.index.value"
                        defaultMessage="Rule {index}"
                        values={{
                          index: index + 1,
                        }}
                      />
                    )}
                  </Typography>
                </ButtonBase>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Field
              disabled={!edit}
              component={TextField}
              type="number"
              placeholder="e.g., 100"
              InputLabelProps={{ shrink: true }}
              name={`settings[${index}].points`}
              label={<FormattedMessage id="points" defaultMessage="Points" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="filled">
                  <AutocompleteMUI
                    disabled={!edit}
                    value={userEvents.find(
                      (u) => u.value === values.settings[index]?.userEventType,
                    )}
                    options={userEvents}
                    onChange={(
                      e: SyntheticEvent,
                      newValue: any,
                      reason: AutocompleteChangeReason,
                      details,
                    ) => {
                      setFieldValue(`settings[${index}]`, {
                        userEventType: newValue?.value,
                        chainId: chainId,
                        points: 0,
                      });
                    }}
                    isOptionEqualToValue={(option: any, value: any) => {
                      return option.value === value;
                    }}
                    getOptionLabel={(option: {
                      name?: string;
                      value?: string;
                    }) => option?.name || ' '}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextFieldMUI
                        {...params}
                        // We have to manually set the corresponding fields on the input component

                        //@ts-ignore
                        error={
                          //@ts-ignore
                          touched[`settings[${index}].userEventType`] &&
                          //@ts-ignore
                          !!errors[`settings[${index}].userEventType`]
                        }
                        helperText={
                          //@ts-ignore
                          errors[`settings[${index}].userEventType`]
                        }
                        label={
                          <FormattedMessage
                            id="user.event.alt"
                            defaultMessage="User event"
                          />
                        }
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {values.settings[index]?.userEventType &&
            values.settings[index]?.userEventType !==
              UserEvents.loginSignMessage && (
              <Grid item xs={12} sm={9}>
                <Accordion disableGutters>
                  <AccordionSummary
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? undefined
                          : theme.palette.grey[300],
                    }}
                    expandIcon={<ArrowDownward />}
                  >
                    <Typography fontWeight="500">
                      <FormattedMessage
                        id="filter.event"
                        defaultMessage="Filter event"
                      />
                    </Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails
                    sx={{
                      pt: 3,
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                    }}
                  >
                    {renderFilter(values.settings[index]?.userEventType)}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

          <Grid item xs={12}>
            {edit ? (
              <Box>
                <Stack direction="row" spacing={2}>
                  {!isNew && (
                    <Button size="small" color="error" onClick={onRemove}>
                      <FormattedMessage id="remove" defaultMessage="Remove" />
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      if (isNew) {
                        return onRemove();
                      }
                      setEdit(false);
                    }}
                  >
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </Button>

                  {values.settings[index]?.userEventType && (
                    <Button
                      size="small"
                      onClick={() => {
                        setEdit(false);
                        onSave();
                      }}
                      variant="contained"
                    >
                      {isNew ? (
                        <FormattedMessage id="add" defaultMessage="Add" />
                      ) : (
                        <FormattedMessage
                          id="update"
                          defaultMessage="Updated"
                        />
                      )}
                    </Button>
                  )}
                </Stack>
              </Box>
            ) : (
              <Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => setEdit(true)}
                  >
                    <FormattedMessage id="edit" defaultMessage="Edit" />
                  </Button>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
