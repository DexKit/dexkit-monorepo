import { Container, Grid } from '@mui/material';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { DexGeneratorPageSection } from '../../types/section';
import ClaimAirdropERC20Section from './ClaimAirdropERC20Section';
import CollectionSection from './CollectionSection';
import EditionDropSection from './EditionDropSection';
import NftDropSection from './NftDropSection';
import StakeErc1155Section from './StakeErc1155Section';
import StakeErc20Section from './StakeErc20Section';
import StakeErc721Section from './StakeErc721Section';
import TokenDropSection from './TokenDropSection';
import TokenErc20Section from './TokenErc20Section';

export interface DexGeneratorSectionProps {
  section?: DexGeneratorPageSection;
  hideGrid?: boolean;
}

export default function DexGeneratorSection({
  section,
  hideGrid,
}: DexGeneratorSectionProps) {
  const { provider } = useWeb3React();

  const renderSection = () => {
    if (section?.section) {
      const { type } = section.section;

      if (type === 'token-drop') {
        return <TokenDropSection section={section.section} />;
      } else if (type === 'nft-drop') {
        return <NftDropSection section={section.section} />;
      } else if (type === 'edition-drop-section') {
        return <EditionDropSection section={section.section} />;
      } else if (type === 'token') {
        return <TokenErc20Section section={section.section} />;
      } else if (type === 'collection') {
        return <CollectionSection section={section.section} />;
      } else if (type === 'nft-stake') {
        return (
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={hideGrid ? 12 : 4}>
              <StakeErc721Section section={section.section} />
            </Grid>
          </Grid>
        );
      } else if (type === 'token-stake') {
        return (
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={hideGrid ? 12 : 4}>
              <StakeErc20Section section={section.section} />
            </Grid>
          </Grid>
        );
      } else if (type === 'edition-stake') {
        return (
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={hideGrid ? 12 : 4}>
              <StakeErc1155Section section={section.section} />
            </Grid>
          </Grid>
        );
      } else if (type === 'claim-airdrop-token-erc-20') {
        return (
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={hideGrid ? 12 : 4}>
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
      <ThirdwebSDKProvider
        signer={provider?.getSigner()}
        activeChain={section?.contract?.chainId}
        clientId={THIRDWEB_CLIENT_ID}
      >
        {renderSection()}
      </ThirdwebSDKProvider>
    </Container>
  );
}
