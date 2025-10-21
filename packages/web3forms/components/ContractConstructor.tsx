import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { FormattedMessage } from "react-intl";

import { Field, Formik } from "formik";

import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseChainId } from "@dexkit/core/utils";
import {
  Avatar,
  CircularProgress,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import { Autocomplete, TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { ReactNode, useCallback, useState } from "react";
import { CallParams, FunctionInput, ThirdWebDeployFormParams } from "../types";
import { getSchemaForInputs } from "../utils";

export function isFunctionCall(stateMutability: string) {
  return stateMutability === "nonpayable" || stateMutability === "payable";
}

export interface ContractConstructorProps {
  inputs: FunctionInput[];
  name?: string;
  stateMutability: string;
  onCall: ({ name, args, call, payable }: CallParams) => void;
  onSwitchNetwork?: (chainId?: ChainId) => Promise<void>;
  chainId?: ChainId;
  isLoading?: boolean;
  params: ThirdWebDeployFormParams;
}

export default function ContractConstructor({
  isLoading,
  inputs,
  name,
  stateMutability,
  onCall,
  chainId,
  onSwitchNetwork,
  params,
}: ContractConstructorProps) {
  const renderInputs = () => {
    return inputs.map((input, key) => {
      if (input.type === "address[]") {
        return (
          <Grid size={12} key={key}>
            <Field
              component={Autocomplete}
              freeSolo
              multiple
              size="small"
              autoSelect
              name={input.name}
              options={[]}
              filterSelectedOptions
              renderInput={(params: any) => (
                <MuiTextField
                  {...params}
                  label={
                    <FormattedMessage
                      id="addresses"
                      defaultMessage="Addresses"
                    />
                  }
                  placeholder="Address"
                />
              )}
            />
          </Grid>
        );
      }

      return (
        <Grid size={12} key={key}>
          <Field
            component={TextField}
            size="small"
            fullWidth
            label={input.name}
            name={input.name}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {input.type.toUpperCase()}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      );
    });
  };

  const getInitialValues = useCallback((inputs: FunctionInput[]) => {
    let obj: { [key: string]: any } = {};

    for (let input of inputs) {
      if (input.type === "address[]") {
        obj[input.name] = [];
      } else {
        obj[input.name] = "";
      }
    }

    return obj;
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        onCall({
          name: !name ? "constructor" : name,
          args: Object.keys(values).map((key) => values[key]),
          call: isFunctionCall(stateMutability),
          payable: stateMutability === "payable",
        });
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }
    },
    [name, stateMutability, onCall]
  );

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    chainId ? chainId : ChainId.Ethereum
  );

  const handleChangeChainId = (
    event: SelectChangeEvent<number>,
    child: ReactNode
  ) => {
    setSelectedChainId(parseChainId(event.target.value));
  };

  const handleSubmitClick = useCallback(
    (submitForm: () => void) => {
      if (chainId !== selectedChainId) {
        return async () => {
          if (onSwitchNetwork) {
            await onSwitchNetwork(selectedChainId);
            submitForm();
          }
        };
      }

      return () => {
        submitForm();
      };
    },
    [chainId, selectedChainId]
  );

  return (
    <Formik
      initialValues={getInitialValues(inputs)}
      onSubmit={handleSubmit}
      validationSchema={getSchemaForInputs(inputs)}
    >
      {({ submitForm, isValid }) => (
        <Box>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1">
                <FormattedMessage
                  id="select.the.network.you.want.to.deploy.this.contract"
                  defaultMessage="Select the network you want to deploy this contract"
                />
              </Typography>
            </Grid>
            <Grid size={12}>
              <Select
                renderValue={(value) => {
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src={NETWORKS[selectedChainId].imageUrl || ""}
                        style={{ width: "auto", height: "1rem" }}
                      />
                      <Typography variant="body1">
                        {NETWORKS[selectedChainId].name}
                      </Typography>
                    </Stack>
                  );
                }}
                fullWidth
                value={chainId}
                onChange={handleChangeChainId}
              >
                {Object.keys(NETWORKS)
                  .map((key) => NETWORKS[parseChainId(key)])
                  .filter((n) => {
                    return !(
                      n.testnet && process.env.NODE_ENV === "production"
                    );
                  })
                  .map((network) => (
                    <MenuItem
                      value={network.chainId.toString()}
                      key={network.chainId}
                    >
                      <Box mr={2}>
                        <Avatar
                          src={network.imageUrl}
                          sx={{ width: "1.5rem", height: "1.5rem" }}
                        />
                      </Box>
                      <ListItemText primary={network.name} />
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1">
                <FormattedMessage
                  id="pass.contract.contructor.arguments"
                  defaultMessage="Pass the contract constructor arguments"
                />
              </Typography>
            </Grid>
            {renderInputs()}
            <Grid size={12}>
              <Button
                startIcon={
                  isLoading && <CircularProgress color="inherit" size="1rem" />
                }
                disabled={!isValid || isLoading}
                onClick={handleSubmitClick(submitForm)}
                variant="contained"
              >
                {chainId !== selectedChainId ? (
                  <FormattedMessage
                    id="switch.network"
                    defaultMessage="Switch Network"
                  />
                ) : (
                  <FormattedMessage id="deploy" defaultMessage="Deploy" />
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}
