import {
  Box,
  Container,
  Stack,
  Typography,
  useTheme
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
            <Box sx={{ mb: theme.spacing(2) }}>
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
            </Box>
            {!slug && (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
                width: '100%'
              }}>
                {deployableContractsQuery.data
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((contract, key) => (
                    <Box key={key} sx={{ width: '100%' }}>
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
                    </Box>
                  ))}
              </Box>
            )}
            {slug && (
              <Box>
                <ContractDeployContainer
                  slug={slug}
                  creator={creator}
                  hideButtonForm={true}
                  onGoBack={() => setSlug("")}
                  onGoToContract={onGoToContract}
                  onGoToListContracts={onGoToListContracts}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
