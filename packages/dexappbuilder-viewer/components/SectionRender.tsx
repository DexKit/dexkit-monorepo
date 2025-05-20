import LazyComponent from "@dexkit/ui/components/LazyComponent";
import type { AppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
const CodeSection = dynamic(() => import("./sections/CodeSection"));
const CollectionSection = dynamic(() => import("./sections/CollectionSection"));
const DexGeneratorSection = dynamic(
  () => import("./sections/DexGeneratorSection")
);
const AssetSection = dynamic(() => import("./sections/AssetSection"));
const RankingSection = dynamic(() => import("./sections/RankingSection"));
const TokenTradeSection = dynamic(() => import("./sections/TokenTradeSection"));
const CarouselSection = dynamic(() => import("./sections/CarouselSection"));
const ShowCaseSection = dynamic(() => import("./sections/ShowCaseSection"));

const ExchangeSection = dynamic(() => import("./sections/ExchangeSection"));
const AssetStoreSection = dynamic(() => import("./sections/AssetStoreSection"));
const MDSection = dynamic(() => import("./sections/MDSection"));

const CallToActionSection = dynamic(
  () => import("./sections/CallToActionSection")
);
const WalletSection = dynamic(() => import("./sections/WalletSection"));
const CollectionsSection = dynamic(
  () => import("./sections/CollectionsSection")
);
const CustomSection = dynamic(() => import("./sections/CustomSection"));
const FeaturedSection = dynamic(() => import("./sections/FeaturedSection"));
const SwapSection = dynamic(() => import("./sections/SwapSection"));
const VideoSection = dynamic(() => import("./sections/VideoSection"));

const ContractSection = dynamic(() => import("./sections/ContractSection"));
const UserContractSection = dynamic(
  () => import("./sections/UserContractSection")
);

const CommerceSection = dynamic(
  () => import("@dexkit/ui/modules/commerce/components/CommerceSection")
);

interface Props {
  section: AppPageSection;
  useLazy?: boolean;
}

export function SectionToRender({ section }: Props) {
  if (!section) {
    return null;
  }

  if (section.type === "featured") {
    return <FeaturedSection title={section.title} items={section.items} />;
  } else if (section.type === "video") {
    return (
      <VideoSection
        embedType={section.embedType}
        videoUrl={section.videoUrl}
        title={section.title}
      />
    );
  } else if (section.type === "call-to-action") {
    return <CallToActionSection section={section} />;
  } else if (section.type === "collections") {
    return <CollectionsSection section={section} />;
  } else if (section.type === "custom") {
    return <CustomSection section={section} />;
  } else if (section.type === "swap") {
    return <SwapSection section={section} />;
  } else if (section.type === "asset-store") {
    return <AssetStoreSection section={section} />;
  } else if (section.type === "markdown") {
    return <MDSection section={section} />;
  } else if (section.type === "wallet") {
    return <WalletSection section={section} />;
  } else if (section.type === "contract") {
    return <ContractSection section={section} />;
  } else if (section.type === "user-contract-form") {
    return <UserContractSection section={section} />;
  } else if (section.type === "exchange") {
    return <ExchangeSection section={section} />;
  } else if (section.type === "code-page-section") {
    return <CodeSection section={section} />;
  } else if (section.type === "collection") {
    return <CollectionSection section={section} />;
  } else if (section.type === "dex-generator-section") {
    return <DexGeneratorSection section={section} />;
  } else if (section.type === "asset-section") {
    return <AssetSection section={section} />;
  } else if (section.type === "ranking") {
    return <RankingSection section={section} />;
  } else if (section.type === "token-trade") {
    return <TokenTradeSection section={section} />;
  } else if (section.type === "carousel") {
    return <CarouselSection section={section} />;
  } else if (section.type === "showcase") {
    return <ShowCaseSection section={section} />;
  } else if (section.type === "commerce") {
    return <CommerceSection section={section} />;
  }
}

export function SectionRender({ section, useLazy }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!section?.type) {
    return <></>;
  }

  const getSection = SectionToRender({ section });

  if (getSection) {
    if (useLazy) {
      return (
        <Box sx={{
          px: 0,
          py: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}>
          <LazyComponent>{getSection}</LazyComponent>
        </Box>
      );
    } else {
      return (
        <Box sx={{
          px: 0,
          py: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}>
          {getSection}
        </Box>
      );
    }
  }

  return <></>;
}
