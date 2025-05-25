import { CommercePageSection } from "@dexkit/ui/modules/wizard/types/section";

import { DexkitApiProvider } from "@dexkit/core/providers";
import { Box, Container, NoSsr, Stack } from "@mui/material";
import useCommerce from "../../hooks/useCommerce";
import CommerceContextProvider from "../CommerceContextProvider";
import CartContent from "./CartContent";
import CheckoutContent from "./CheckoutContent";
import CollectionContent from "./CollectionContent";
import ProductContent from "./ProductContent";
import StoreContent from "./StoreContent";

import { myAppsApi } from "@dexkit/ui/constants/api";

export interface CommerceSectionProps {
  section: CommercePageSection;
}

function CommerceSectionComponent({ section }: CommerceSectionProps) {
  const { productId, showCart } = useCommerce();

  if (showCart) {
    return (
      <Container>
        <CartContent />
      </Container>
    );
  }

  if (section.type === "commerce") {
    if (section.settings.content.type === "store") {
      if (productId) {
        return (
          <Container>
            <ProductContent productId={productId} />
          </Container>
        );
      }
      return <StoreContent />;
    } else if (section.settings.content.type === "checkout") {
      return (
        <Container>
          <CheckoutContent id={section.settings.content.id} />
        </Container>
      );
    } else if (section.settings.content.type === "collection") {
      if (productId) {
        return (
          <Container>
            <ProductContent productId={productId} />
          </Container>
        );
      }

      return <CollectionContent id={section.settings.content.id} />;
    } else if (section.settings.content.type === "single-product") {

      console.log('product', section.settings.content );

      
      return (
        <Container>
          <ProductContent
            productId={section.settings.content.id}
            disableHeader
          />
        </Container>
      );
    }
  }

  return null;
}

export default function CommerceSection({ section }: CommerceSectionProps) {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <CommerceContextProvider section={section}>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Box>
            <NoSsr>
              <CommerceSectionComponent section={section} />
            </NoSsr>
          </Box>
        </Stack>
      </CommerceContextProvider>
    </DexkitApiProvider.Provider>
  );
}
