import { ChainId } from "@dexkit/core";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import { AppExpandableTypography } from "@dexkit/ui/components/AppExpandableTypography";
import Link from "@dexkit/ui/components/AppLink";
import useContractMetadata from "@dexkit/ui/hooks/blockchain";
import { useAsset } from "@dexkit/ui/modules/nft/hooks";
import { useJsonRpcProvider } from "@dexkit/ui/modules/wizard/hooks";
import { ShowCaseItem } from "@dexkit/ui/modules/wizard/types/section";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

export interface ShowCaseCardProps {
  item: ShowCaseItem;
}

export default function ShowCaseCard({ item }: ShowCaseCardProps) {
  const providerQuery = useJsonRpcProvider({
    chainId:
      item.type === "asset" || item.type === "collection"
        ? item.chainId
        : ChainId.Ethereum,
  });

  const assetArgs = useMemo(() => {
    if (item.type === "asset") {
      return [
        item.contractAddress,
        item.tokenId,
        {},
        true,
        item.chainId,
      ] as any;
    }

    return [];
  }, [item]);

  const nftQuery = useAsset(...assetArgs);

  const contractMetadata = useContractMetadata(
    item.type === "collection"
      ? {
        chainId: item.chainId,
        contractAddress: item.contractAddress,
        provider: providerQuery.data,
      }
      : undefined
  );

  if (item.type === "image") {
    return (
      <Card>
        <CardActionArea
          LinkComponent={Link}
          href={
            item.actionType && item?.actionType === "link" && item?.url
              ? item.url
              : item.actionType && item.actionType === "page" && item?.page
                ? item?.page
                : ""
          }
        >
          {item.imageUrl ? (
            <Box
              sx={{
                aspectRatio: "1/1",
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                height: (theme) => theme.spacing(24),
                width: "100%",
                backgroundImage: `url('${item.imageUrl}')`,
              }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: "1/1",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </CardActionArea>
        <Divider />
        {(item?.title || item?.subtitle) && (
          <CardContent sx={{ minHeight: (theme) => theme.spacing(12) }}>
            <Stack spacing={1}>
              <Box>
                {item.title && (
                  <Typography
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                    variant="body1"
                    fontWeight="bold"
                  >
                    {item.title}
                  </Typography>
                )}
                {item.subtitle && (
                  <AppExpandableTypography
                    TypographyProps={{
                      sx: { textOverflow: "ellipsis", overflow: "hidden" },
                      variant: "body2",
                      color: "text.secondary",
                    }}
                    value={item.subtitle || ""}
                  />
                )}
              </Box>
            </Stack>
          </CardContent>
        )}
      </Card>
    );
  }

  if (item.type === "collection") {
    return (
      <Card>
        <CardActionArea
          LinkComponent={Link}
          href={`/collection/${getNetworkSlugFromChainId(item.chainId)}/${item.contractAddress
            }`}
        >
          {item.imageUrl ? (
            <CardMedia image={item.imageUrl} sx={{ aspectRatio: "1/1" }} />
          ) : contractMetadata.data?.image ? (
            <CardMedia
              image={
                contractMetadata.data?.image
                  ? ipfsUriToUrl(contractMetadata.data?.image)
                  : undefined
              }
              sx={{ aspectRatio: "1/1" }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: "1/1",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </CardActionArea>

        <Divider />
        <CardContent sx={{ minHeight: (theme) => theme.spacing(16) }}>
          <Stack spacing={1}>
            <Box>
              <Typography
                sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                variant="body1"
                fontWeight="bold"
              >
                {item.title ? (
                  item.title
                ) : contractMetadata.data?.name ? (
                  contractMetadata.data?.name
                ) : (
                  <Skeleton />
                )}
              </Typography>

              {item.subtitle ? <AppExpandableTypography
                TypographyProps={{
                  sx: { textOverflow: "ellipsis", overflow: "hidden" },
                  variant: "body2",
                  color: "text.secondary",
                }}
                value={contractMetadata.data?.name || ""}
              /> : (
                <AppExpandableTypography
                  TypographyProps={{
                    sx: { textOverflow: "ellipsis", overflow: "hidden" },
                    variant: "body2",
                    color: "text.secondary",
                  }}
                  value={contractMetadata.data?.description || ""}
                />
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardActionArea
        LinkComponent={Link}
        href={`/asset/${getNetworkSlugFromChainId(item.chainId)}/${item.contractAddress
          }/${item.tokenId}`}
      >
        {nftQuery.data?.metadata?.image ? (
          <CardMedia
            image={
              nftQuery.data?.metadata?.image
                ? ipfsUriToUrl(nftQuery.data?.metadata?.image)
                : undefined
            }
            sx={{ aspectRatio: "1/1" }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              aspectRatio: "1/1",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </CardActionArea>
      <Divider />
      <CardContent sx={{ minHeight: (theme) => theme.spacing(16) }}>
        <Stack spacing={1}>
          <Box>
            <Typography
              sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
              variant="body1"
              fontWeight="bold"
            >
              {nftQuery.isLoading ? (
                <Skeleton />
              ) : (
                <>
                  {nftQuery.data?.metadata?.name
                    ? nftQuery.data?.metadata?.name
                    : `${nftQuery.data?.collectionName} #${nftQuery.data?.id}`}
                </>
              )}
            </Typography>
            <Typography
              sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
              variant="body2"
              color="text.secondary"
            >
              {nftQuery.isLoading ? (
                <Skeleton />
              ) : (
                <AppExpandableTypography
                  value={
                    nftQuery.data?.metadata?.description
                      ? nftQuery.data?.metadata?.description || ""
                      : `${nftQuery.data?.collectionName} #${nftQuery.data?.id}`
                  }
                  TypographyProps={{
                    sx: { textOverflow: "ellipsis", overflow: "hidden" },
                    variant: "body2",
                    color: "text.secondary",
                  }}
                />
              )}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
