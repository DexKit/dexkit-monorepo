import { useListFormsQuery } from '@/modules/forms/hooks';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import InfoIcon from '@mui/icons-material/Info';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import UserContractFormCard from '../UserContractFormCard';

interface Props {
  onSave: (formId?: number, hideFormInfo?: boolean) => void;
  onCancel: () => void;
  formId?: number;
  hideFormInfo?: boolean;
  saveOnChange?: boolean;
}

export function UserContractForm({
  onSave,
  onCancel,
  formId,
  hideFormInfo,
  saveOnChange,
}: Props) {
  const { account } = useWeb3React();

  const [query, setQuery] = useState<string>();

  const listFormsQuery = useListFormsQuery({ creatorAddress: account, query });

  const [selectedFormId, setSelectedFormId] = useState<number>();

  const [hideInfo, setHideInfo] = useState<boolean>(false);

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const handleClick = useCallback(
    (id: number) => {
      setSelectedFormId(id);

      if (saveOnChange && id) {
        onSave(id, hideInfo);
      }
    },
    [saveOnChange, hideInfo]
  );

  const handleSave = useCallback(() => {
    if (selectedFormId) {
      onSave(selectedFormId, hideInfo);
    }
  }, [onSave, selectedFormId, hideInfo]);

  const handleChangeHideInfo = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (saveOnChange) {
        onSave(selectedFormId, e.target.checked);
      }
      setHideInfo(e.target.checked);
    },
    [saveOnChange]
  );

  useEffect(() => {
    if (!selectedFormId) {
      setSelectedFormId(formId);
    }
    if (hideFormInfo !== undefined) {
      setHideInfo(hideFormInfo);
    }
  }, [formId, hideFormInfo]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LazyTextField
            TextFieldProps={{
              size: 'small',
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {listFormsQuery.data?.map((form) => (
              <Grid key={form.id} item xs={12}>
                <UserContractFormCard
                  id={form.id}
                  description={form.description}
                  name={form.name}
                  selected={selectedFormId === form.id}
                  onClick={handleClick}
                />
              </Grid>
            ))}
            {listFormsQuery.isLoading &&
              new Array(5).fill(null).map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">
                        <Skeleton />
                      </Typography>
                      <Typography variant="body1">
                        <Skeleton />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            {listFormsQuery.data && listFormsQuery.data?.length === 0 && (
              <Grid item xs={12}>
                <Box py={2}>
                  <Stack spacing={2} alignItems="center">
                    <TipsAndUpdatesIcon fontSize="large" />
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="you.dont.have.any.forms"
                          defaultMessage="You don't have any forms yet"
                        />
                      </Typography>
                      <Typography align="center" variant="body1">
                        <FormattedMessage
                          id="please.create.a.form.to.start.using.it.here"
                          defaultMessage="Please, create a form to start using it here"
                        />
                      </Typography>
                    </Box>
                    <Button
                      LinkComponent={Link}
                      href="/forms/create"
                      variant="contained"
                      color="primary"
                      target="_blank"
                      startIcon={<AddIcon />}
                    >
                      <FormattedMessage
                        id="create.form"
                        defaultMessage="Create form"
                      />
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" alignContent="center">
            <FormControlLabel
              control={
                <Checkbox checked={hideInfo} onChange={handleChangeHideInfo} />
              }
              label={
                <FormattedMessage
                  id="hide.form.info"
                  defaultMessage="Hide form info"
                />
              }
            />
            <Tooltip
              title={
                <FormattedMessage
                  id="hide.form.info.tooltip"
                  defaultMessage="Hide form info like: contract address, description and name from the section"
                />
              }
            >
              <InfoIcon />
            </Tooltip>
          </Stack>
        </Grid>
        {!saveOnChange && (
          <Grid item xs={12}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  onClick={handleSave}
                  disabled={selectedFormId === undefined}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
