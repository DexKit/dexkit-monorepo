import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { FormattedMessage } from "react-intl";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from "@dexkit/core/constants/networks";
import { Asset, AssetMetadata } from "@dexkit/core/types/nft";
import { truncateAddress } from "@dexkit/core/utils";
import Link from "../../../components/AppLink";
import { truncateErc1155TokenId } from "../utils";
import AssetAttributePaper from "./AssetAttributePaper";

interface Props {
  asset?: Asset;
  metadata?: AssetMetadata;
}

export function AssetDetailsBase({ asset, metadata }: Props) {
  return (
    <Stack spacing={1}>
      <Box>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="description"
                defaultMessage="Description"
                description="Description Accordion"
              />
            </Typography>
          </AccordionSummary>

          <Divider />
          <AccordionDetails sx={{ p: (theme) => theme.spacing(2) }}>
            {metadata?.description && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {metadata?.description}
              </ReactMarkdown>
            )}

            {/*<Typography color="textSecondary">{description}</Typography>*/}
          </AccordionDetails>
        </Accordion>
      </Box>
      {metadata !== undefined &&
        metadata?.attributes !== undefined &&
        metadata?.attributes?.length > 0 && (
          <Box>
            <Accordion disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon color="primary" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography sx={{ fontWeight: 600 }}>
                  <FormattedMessage
                    id="attributes"
                    defaultMessage="Attributes"
                    description="Attributes accordion"
                  />
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails sx={{ p: (theme) => theme.spacing(2) }}>
                <Grid container spacing={2}>
                  {metadata?.attributes?.map(
                    (attr, index: number) =>
                      attr.trait_type &&
                      attr.value !== undefined && (
                        <Grid item xs={4} key={index}>
                          <AssetAttributePaper
                            traitType={attr.trait_type}
                            value={attr.value}
                          />
                        </Grid>
                      ),
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

      <Box>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="accordion.details"
                defaultMessage="Details"
                description="Details in the nft accordion"
              />
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails sx={{ p: (theme) => theme.spacing(2) }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="textSecondary">
                  <FormattedMessage
                    id="contract.address"
                    defaultMessage="Contract Address"
                    description="Accordion contract address"
                  />
                </Typography>
                <Typography color="textSecondary">
                  <Link
                    href={`${NETWORK_EXPLORER(
                      asset?.chainId,
                    )}/address/${asset?.contractAddress}`}
                    target="_blank"
                  >
                    {truncateAddress(asset?.contractAddress)}
                  </Link>
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="textSecondary">
                  <FormattedMessage
                    id="token.id"
                    defaultMessage="Token ID"
                    description="Token id caption"
                  />
                </Typography>
                <Typography color="textSecondary">
                  {truncateErc1155TokenId(asset?.id)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="textSecondary">
                  <FormattedMessage
                    id="Network"
                    defaultMessage="Network"
                    description="Network caption"
                  />
                </Typography>
                <Typography color="textSecondary">
                  {NETWORK_NAME(asset?.chainId)}
                </Typography>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
