import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Container, Grid } from "@mui/material";

import { DexGeneratorPageSection } from "@dexkit/ui/modules/wizard/types/section";
import ThirdwebV4Provider from "@dexkit/ui/providers/ThirdwebV4Provider";
import ClaimAirdropERC20Section from "./ClaimAirdropERC20Section";
import CollectionSection from "./CollectionSection";
import EditionDropSection from "./EditionDropSection";
import NftDropSection from "./NftDropSection";
import StakeErc1155Section from "./StakeErc1155Section";
import StakeErc20Section from "./StakeErc20Section";
import StakeErc721Section from "./StakeErc721Section";
import TokenDropSection from "./TokenDropSection";
import TokenErc20Section from "./TokenErc20Section";

export interface DexGeneratorSectionProps {
  section?: DexGeneratorPageSection;
  hideGrid?: boolean;
}

export default function DexGeneratorSection({
  section,
  hideGrid,
}: DexGeneratorSectionProps) {
  const { signer } = useWeb3React();

  const renderSection = () => {
    if (section?.section) {
      const { type } = section.section;

      if (type === "token-drop") {
        return <TokenDropSection section={section.section} />;
      } else if (type === "nft-drop") {
        return <NftDropSection section={section.section} />;
      } else if (type === "edition-drop-section") {
        return <EditionDropSection section={section.section} />;
      } else if (type === "token") {
        return <TokenErc20Section section={section.section} />;
      } else if (type === "collection") {
        return <CollectionSection section={section.section} />;
      } else if (type === "nft-stake") {
        return (
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, sm: hideGrid ? 12 : 4 }}>
              <StakeErc721Section section={section.section} />
            </Grid>
          </Grid>
        );
      } else if (type === "token-stake") {
        return (
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, sm: hideGrid ? 12 : 4 }}>
              <StakeErc20Section section={section.section} />
            </Grid>
          </Grid>
        );
      } else if (type === "edition-stake") {
        return (
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, sm: hideGrid ? 12 : 4 }}>
              <StakeErc1155Section section={section.section} />
            </Grid>
          </Grid>
        );
      } else if (type === "claim-airdrop-token-erc-20") {
        return (
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, sm: hideGrid ? 12 : 4 }}>
              <ClaimAirdropERC20Section section={section.section} />
            </Grid>
          </Grid>
        );
      }
    }

    return null;
  };

  return (
    <Container sx={{ py: 2 }}>
      <ThirdwebV4Provider chainId={section?.contract?.chainId}>
        {renderSection()}
      </ThirdwebV4Provider>
    </Container>
  );
}
