import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseChainId } from "@dexkit/core/utils";
import { useActiveChainIds } from "@dexkit/ui";
import Search from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useSnackbar } from "notistack";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CHECKOUT_TOKENS } from "../../../constants";
import useCheckoutNetworks from "../../../hooks/checkout/useCheckoutNetworks";
import useUpdateCheckoutNetworks from "../../../hooks/useUpdateCheckoutNetworks";
import useParams from "../hooks/useParams";

interface CheckoutNetworksBaseProps {
  networks: { chainId: number }[];
}

const commerceSettingsAtomTestnets = atomWithStorage(
  "dexkit.commerce.show.testnets",
  false
);

function CheckoutNetworksBase({ networks }: CheckoutNetworksBaseProps) {
  const { activeChainIds } = useActiveChainIds();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [query, setQuery] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const [showTestnets, setShowTestnets] = useAtom(commerceSettingsAtomTestnets);

  const availNetworks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => ![ChainId.Goerli, ChainId.Mumbai].includes(n.chainId))
      .filter((n) => {
        if (!showTestnets && n.testnet) {
          return false;
        }

        return true;
      })
      .filter((n) => activeChainIds.includes(n.chainId))
      .filter((n) => {
        let token = CHECKOUT_TOKENS.find((t) => t.chainId === n.chainId);

        return Boolean(token);
      })
      .filter((n) => n.name.toLowerCase().search(query.toLowerCase()) > -1)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeChainIds, query, showTestnets]);

  const value: { [key: string]: boolean } = networks.reduce(
    (prev, curr: { chainId: number }) => {
      prev[curr.chainId.toString()] = true;

      return prev;
    },
    {} as { [key: string]: boolean }
  );

  const [checked, setChecked] = useState<{ [key: string]: boolean }>(value);

  const handleToggle = useCallback((chainId: ChainId) => {
    return () => {
      setChecked((values) => ({
        ...values,
        [chainId]: !Boolean(values[chainId]),
      }));
    };
  }, []);

  const { mutateAsync: update } = useUpdateCheckoutNetworks();

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const handleSave = async () => {
    const chainIds = Object.keys(checked)
      .filter((n) => checked[n])
      .map(Number);

    try {
      await update({ chainIds });
      enqueueSnackbar(
        <FormattedMessage
          id="networks.updated"
          defaultMessage="Networks updated"
        />,
        { variant: "success" }
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const { goBack } = useParams();

  return (
    <Stack spacing={2}>
      <Box>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          alignItems={isMobile ? "stretch" : "center"} 
          spacing={2}
        >
          <TextField
            variant="standard"
            size="small"
            fullWidth={isMobile}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            placeholder={formatMessage({
              id: "search.networks",
              defaultMessage: "Search networks",
            })}
            value={query}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showTestnets}
                onChange={() => setShowTestnets((value) => !value)}
              />
            }
            label={
              <FormattedMessage
                id="show.testnets"
                defaultMessage="Show testnets"
              />
            }
          />
        </Stack>
      </Box>
      
      <Box>
        <Box
          sx={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
            gap: 2,
            height: isMobile ? "auto" : "18rem",
            maxHeight: isMobile ? "none" : "18rem",
            overflowY: isMobile ? "visible" : "auto"
          }}
        >
          {availNetworks.map((network, key) => (
            <Box key={key}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={Boolean(checked[network.chainId])}
                  onClick={handleToggle(network.chainId)}
                />
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  {network.name}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
      
      <Divider />
      
      <Box sx={{ mt: 2 }}>
        <Stack 
          direction="row" 
          justifyContent="flex-end" 
          spacing={2}
          sx={{ 
            "& > *": {
              width: isMobile ? "50%" : "auto"
            }
          }}
        >
          <Button 
            onClick={goBack} 
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
          >
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            fullWidth={isMobile}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default function CheckoutNetworksUpdateForm() {
  const { data: networks, isFetched } = useCheckoutNetworks();

  return (
    networks && isFetched && <CheckoutNetworksBase networks={networks ?? []} />
  );
}
