import Link from "@dexkit/ui/components/AppLink";
import { NFTCardMedia } from "@dexkit/ui/modules/nft/components/NFTCardMedia";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { NFT } from "@thirdweb-dev/sdk";
import { useInView } from "react-intersection-observer";

export interface NFTGridProps {
  nfts: NFT[];
  address: string;
  network: string;
  onClick?: (tokenId: string) => void;
  selectedTokenId?: string;
  isLoading?: boolean;
}

export default function NFTGrid({
  nfts,
  network,
  address,
  onClick,
  selectedTokenId,
  isLoading = false,
}: NFTGridProps) {
  const LazyNFTCard = ({ nft, index }: { nft: NFT; index: number }) => {
    const shouldLoadImmediately = index < 4;
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: "50px",
      skip: shouldLoadImmediately,
    });

    const shouldRender = shouldLoadImmediately || inView;

    const cardContent = (
      <>
        {shouldRender ? (
          <NFTCardMedia
            metadata={nft.metadata as any}
            network={network}
            contractAddress={address}
            tokenId={nft.metadata.id}
            aspectRatio="1/1"
            priority={shouldLoadImmediately}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              aspectRatio: "1/1",
              width: "100%",
            }}
          />
        )}
        <Divider />
        <CardContent>
          <Typography variant="caption" color="primary">
            {onClick ? (
              nft.metadata?.name
            ) : (
              <Link href={`/contract/${network}/${address}/${nft.metadata.id}`}>
                {nft.metadata?.name}
              </Link>
            )}
          </Typography>
          <Typography>#{nft.metadata?.id}</Typography>
        </CardContent>
      </>
    );

    if (onClick) {
      return (
        <Card
          ref={ref}
          sx={
            selectedTokenId === nft.metadata.id
              ? { borderColor: (theme) => theme.palette.primary.main }
              : undefined
          }
        >
          <CardActionArea onClick={() => onClick(nft.metadata.id)}>
            {cardContent}
          </CardActionArea>
        </Card>
      );
    }

    return (
      <Card ref={ref}>
        <CardActionArea
          LinkComponent={Link}
          href={`/contract/${network}/${address}/${nft.metadata.id}`}
        >
          {cardContent}
        </CardActionArea>
      </Card>
    );
  };


  return (
    <Grid container spacing={2}>
      {isLoading && (
        <>
          {[...Array(8)].map((_, key) => (
            <Grid size={{ xs: 6, sm: 3 }} key={key}>
              <Card>
                <CardActionArea>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      aspectRatio: "1/1",
                      width: "100%",
                    }}
                  />
                  <Divider />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </>
      )}
      {!isLoading && nfts?.map((nft, index) => (
        <Grid size={{ xs: 6, sm: 3 }} key={nft.metadata.id || index}>
          <LazyNFTCard nft={nft} index={index} />
        </Grid>
      ))}
    </Grid>
  );
}
