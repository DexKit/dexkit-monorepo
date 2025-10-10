import { getNormalizedUrl } from "@dexkit/core/utils";
import Link from "@dexkit/ui/components/AppLink";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { NFT } from "@thirdweb-dev/sdk";

export interface NFTGridProps {
  nfts: NFT[];
  address: string;
  network: string;
  onClick?: (tokenId: string) => void;
  selectedTokenId?: string;
}

export default function NFTGrid({
  nfts,
  network,
  address,
  onClick,
  selectedTokenId,
}: NFTGridProps) {
  const renderCard = (nft: NFT) => {
    if (onClick) {
      return (
        <Card
          sx={
            selectedTokenId === nft.metadata.id
              ? { borderColor: (theme) => theme.palette.primary.main }
              : undefined
          }
        >
          <CardActionArea onClick={() => onClick(nft.metadata.id)}>
            {nft.metadata?.image ? (
              <CardMedia
                image={getNormalizedUrl(nft.metadata?.image)}
                sx={{ aspectRatio: "1/1", height: "100%" }}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ aspectRatio: "16/9", height: "100%" }}
              />
            )}
            <Divider />
            <CardContent>
              <Typography variant="caption" color="primary">
                {nft.metadata?.name}
              </Typography>
              <Typography>#{nft.metadata?.id}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    }

    return (
      <Card>
        <CardActionArea
          LinkComponent={Link}
          href={`/contract/${network}/${address}/${nft.metadata.id}`}
        >
          {nft.metadata?.image ? (
            <CardMedia
              image={getNormalizedUrl(nft.metadata?.image)}
              sx={{ aspectRatio: "1/1", height: "100%" }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ aspectRatio: "16/9", height: "100%" }}
            />
          )}
        </CardActionArea>
        <Divider />
        <CardContent>
          <Typography variant="caption" color="primary">
            <Link href={`/contract/${network}/${address}/${nft.metadata.id}`}>
              {nft.metadata?.name}
            </Link>
          </Typography>
          <Typography>#{nft.metadata.id}</Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container spacing={2}>
      {nfts.map((nft, key) => (
        <Grid size={{ xs: 6, sm: 3 }} key={key}>
          {renderCard(nft)}
        </Grid>
      ))}
    </Grid>
  );
}
