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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    } catch (err) { }
  };

  if (!isSuccess && !rolesValues) {
    return (
      <Box sx={{ py: isMobile ? 2 : 4 }}>
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
        <Grid container spacing={isMobile ? 1 : 2}>
          {Object.keys(rolesValues).map((role, index) => (
            <Grid item xs={12} key={index}>
              <FieldArray
                name={role}
                render={({ name, handlePush, handleRemove }) => (
                  <Card
                    sx={{
                      '& .MuiCardContent-root': {
                        padding: isMobile ? theme.spacing(1.5) : theme.spacing(2),
                        '&:last-child': {
                          paddingBottom: isMobile ? theme.spacing(1.5) : theme.spacing(2),
                        }
                      }
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={isMobile ? 1 : 2}>
                        <Grid item xs={12}>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                            sx={{
                              fontSize: isMobile ? '1rem' : '1rem',
                              fontWeight: 600,
                              mb: isMobile ? 0.5 : 1
                            }}
                          >
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
                          </Typography>
                          <Typography
                            variant={isMobile ? "caption" : "body2"}
                            color="text.secondary"
                            sx={{
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              lineHeight: 1.4
                            }}
                          >
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
                            <Grid alignItems="center" container spacing={isMobile ? 1 : 2}>
                              <Grid item xs>
                                <Field
                                  fullWidth
                                  component={TextField}
                                  name={`${name}[${index}]`}
                                  placeholder={ZERO_ADDRESS}
                                  size={isMobile ? "small" : "medium"}
                                  InputProps={{
                                    sx: {
                                      fontSize: isMobile ? '0.875rem' : '1rem',
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item>
                                <IconButton
                                  onClick={handleRemove(index)}
                                  size={isMobile ? "small" : "medium"}
                                  sx={{
                                    padding: isMobile ? theme.spacing(0.5) : theme.spacing(1),
                                  }}
                                >
                                  <Delete fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Grid alignItems="center" container spacing={isMobile ? 1 : 2}>
                            <Grid item>
                              <Button
                                disabled={isSubmitting}
                                onClick={handlePush('')}
                                size={isMobile ? "small" : "small"}
                                variant="outlined"
                                sx={{
                                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                                  py: isMobile ? 0.5 : 0.75,
                                  px: isMobile ? 1 : 1.5,
                                }}
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
              size={isMobile ? "medium" : "medium"}
              fullWidth={isMobile}
              sx={{
                fontSize: isMobile ? '0.875rem' : '0.875rem',
                py: isMobile ? 1 : 1.25,
                mt: isMobile ? 1 : 0,
              }}
            >
              <FormattedMessage id="update" defaultMessage="Update" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
