import { useDexKitContext } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Delete from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
    useAllRoleMembers,
    useContract,
    useContractMetadata,
    useSetAllRoleMembers,
} from '@thirdweb-dev/react';
import { Field, FieldArray, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { ZERO_ADDRESS } from 'src/constants';
import { THIRDWEB_ROLE_DESCRIPTIONS } from '../constants';
import { ContractAdminSchema } from '../constants/schemas';

type Roles = {
  [key: string]: string[];
};

export interface ContractAdminTabProps {
  address?: string;
}

export default function ContractAdminTab({ address }: ContractAdminTabProps) {
  const { data: contract } = useContract(address);

  const { data: rolesValues, isSuccess } = useAllRoleMembers(contract);
  const { data: contractMetadata } = useContractMetadata(contract);

  const { mutateAsync: grantRole } = useSetAllRoleMembers(contract);

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const { chainId } = useWeb3React();

  const setAllRolesMutation = useMutation(
    async ({ roles }: { roles: Roles }) => {
      const call = await contract?.roles.setAll.prepare(
        roles as {
          [x: string & {}]: string[];
          admin: string[];
          transfer: string[];
          minter: string[];
          pauser: string[];
          lister: string[];
          asset: string[];
          unwrap: string[];
          factory: string[];
          signer: string[];
        },
      );

      let params = { contractName: contractMetadata?.name || '' };

      watchTransactionDialog.open('updateContractRoles', params);

      let tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'updateContractRoles',
          values: params,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    },
  );

  const handleSubmit = async (values: Roles) => {
    try {
      await setAllRolesMutation.mutateAsync({ roles: values });
    } catch (err) {}
  };

  if (!isSuccess && !rolesValues) {
    return (
      <Box sx={{ py: 4 }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <CircularProgress color="primary" size="2rem" />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      validateOnChange
      initialValues={
        rolesValues
          ? rolesValues
          : ({
              admin: [],
            } as { [key: string]: string[] })
      }
      validationSchema={ContractAdminSchema}
    >
      {({ values, submitForm, isSubmitting, isValid }) => (
        <Grid container spacing={2}>
          {Object.keys(rolesValues).map((role, index) => (
            <Grid item xs={12} key={index}>
              <FieldArray
                name={role}
                render={({ name, handlePush, handleRemove }) => (
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>
                              {THIRDWEB_ROLE_DESCRIPTIONS[role]?.title ? (
                                <FormattedMessage
                                  id={
                                    THIRDWEB_ROLE_DESCRIPTIONS[role]?.title.id
                                  }
                                  defaultMessage={
                                    THIRDWEB_ROLE_DESCRIPTIONS[role]?.title
                                      .defaultMessage
                                  }
                                />
                              ) : (
                                role
                              )}
                            </strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {THIRDWEB_ROLE_DESCRIPTIONS[role]?.title ? (
                              <FormattedMessage
                                id={
                                  THIRDWEB_ROLE_DESCRIPTIONS[role]?.description
                                    .id
                                }
                                defaultMessage={
                                  THIRDWEB_ROLE_DESCRIPTIONS[role]?.description
                                    .defaultMessage
                                }
                              />
                            ) : (
                              ''
                            )}
                          </Typography>
                        </Grid>
                        {values[role].map((_, index) => (
                          <Grid item xs={12} key={index}>
                            <Grid alignItems="center" container spacing={2}>
                              <Grid item xs>
                                <Field
                                  fullWidth
                                  component={TextField}
                                  name={`${name}[${index}]`}
                                  placeholder={ZERO_ADDRESS}
                                />
                              </Grid>
                              <Grid item>
                                <IconButton onClick={handleRemove(index)}>
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Grid alignItems="center" container spacing={2}>
                            <Grid item>
                              <Button
                                disabled={isSubmitting}
                                onClick={handlePush('')}
                                size="small"
                                variant="outlined"
                              >
                                <FormattedMessage
                                  id="add"
                                  defaultMessage="Add"
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              disabled={isSubmitting || !isValid}
              startIcon={
                isSubmitting ? (
                  <CircularProgress color="inherit" size="1rem" />
                ) : undefined
              }
              variant="contained"
              onClick={submitForm}
            >
              <FormattedMessage id="update" defaultMessage="Update" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
