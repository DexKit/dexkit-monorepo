import Link from "@dexkit/ui/components/AppLink";
import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";

import { CollectionFromApiCard } from "@dexkit/ui/modules/nft/components";
import { CollectionAppPageSection } from "@dexkit/ui/modules/wizard/types/section";

interface Props {
  section: CollectionAppPageSection;
  disabled?: boolean;
}

export function CollectionsSection({ section, disabled }: Props) {
  const renderItems = () => {
    return section.items
      .filter((item) => item.type === "collection" && !item.featured)
      .map((item, index) => {
        if (item.type === "collection") {
          return (
            <Grid key={index} item xs={6}>
              <CollectionFromApiCard
                totalSupply={0}
                variant="simple"
                chainId={item.chainId}
                contractAddress={item.contractAddress}
                backgroundImageUrl={item.backgroundImageUrl}
                title={item.title}
                disabled={disabled}
              />
            </Grid>
          );
        }
      });
  };

  const renderFeatured = () => {
    const featuredItem = section.items.find(
      (item) => item.type === "collection" && item.featured,
    );

    if (featuredItem && featuredItem.type === "collection") {
      return (
        <CollectionFromApiCard
          variant="simple"
          totalSupply={0}
          chainId={featuredItem.chainId}
          contractAddress={featuredItem.contractAddress}
          backgroundImageUrl={featuredItem.backgroundImageUrl}
          title={featuredItem.title}
        />
      );
    }
  };

  return (
    <Box py={8}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between">
              {/* <Grid item>
                <TextField
                  placeholder="Search collection"
                  variant="outlined"
                  type="search"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid> */}
              <Grid item>
                <Typography variant="h5">
                  {section.title ? (
                    section.title
                  ) : (
                    <FormattedMessage
                      id="collections"
                      defaultMessage="Collections"
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  LinkComponent={Link}
                  href={disabled ? "javascript:void(0)" : "/collections"}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="see.all" defaultMessage="See all" />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} sm={6}>
                {renderFeatured()}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  {renderItems()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CollectionsSection;
