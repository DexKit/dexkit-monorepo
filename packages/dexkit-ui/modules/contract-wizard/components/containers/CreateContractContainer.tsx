import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useDeployableContractsQuery } from "@dexkit/ui/modules/forms/hooks";
import { useState } from "react";
import ContractButton from "../ContractButton";
import ContractDeployContainer from "./ContractDeployContainer";

interface Props {
  onGoToContract: ({
    address,
    network,
  }: {
    address: string;
    network: string;
  }) => void;
  onGoToListContracts: () => void;
}

const IS_DEXKIT_CONTRACT = ["DropAllowanceERC20"];

export default function CreateContractContainer({
  onGoToContract,
  onGoToListContracts,
}: Props) {
  const [slug, setSlug] = useState("");
  const creator = IS_DEXKIT_CONTRACT.includes(slug) ? "dexkit" : "thirdweb";
  const deployableContractsQuery = useDeployableContractsQuery();
  const theme = useTheme();

  return (
    <>
      <Container>
        <Stack spacing={theme.spacing(2)}>
          <Box>
            <Grid container spacing={theme.spacing(2)}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: {
                      xs: theme.typography.h6.fontSize,
                      sm: theme.typography.h5.fontSize,
                    },
                    fontWeight: theme.typography.fontWeightBold,
                    mb: theme.spacing(0.5),
                  }}
                >
                  <FormattedMessage
                    id="deploy.your.contract"
                    defaultMessage="Deploy your contract"
                  />
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: theme.typography.caption.fontSize,
                      sm: theme.typography.body2.fontSize,
                    },
                  }}
                >
                  <FormattedMessage
                    id="easily.integrate.contracts.on.your.app.using.dexcontract.component"
                    defaultMessage="Easily integrate contracts on your app using dexcontract component"
                  />
                </Typography>
              </Grid>
              {/*    <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="thirdweb.contracts"
                    defaultMessage="ThirdWeb Contracts"
                  />
                </Typography>
              </Grid>*/}
              <Grid item xs={12}>
                {!slug && (
                  <Grid container spacing={theme.spacing(2)}>
                    {deployableContractsQuery.data?.map((contract, key) => (
                      <Grid item xs={6} sm={4} key={key}>
                        <ContractButton
                          title={contract.name}
                          description={contract.description}
                          creator={{
                            imageUrl: contract.publisherIcon,
                            name: contract.publisherName,
                          }}
                          onClick={() => {
                            setSlug(contract.slug);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {slug && (
                  <Grid container spacing={theme.spacing(2)}>
                    <ContractDeployContainer
                      slug={slug}
                      creator={creator}
                      hideButtonForm={true}
                      onGoBack={() => setSlug("")}
                      onGoToContract={onGoToContract}
                      onGoToListContracts={onGoToListContracts}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
