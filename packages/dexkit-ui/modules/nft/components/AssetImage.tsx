import { ipfsUriToUrl } from "@dexkit/core/utils";
import { ZoomIn } from "@mui/icons-material";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import { useIntl } from "react-intl";
import useLightbox from "../../../components/lightBox/useLightBox";
import { isWhitelistedDomain } from "../../../utils/image";

function isIpfsUrlWithoutExtension(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  const isIpfs = lowerUrl.includes('ipfs') || lowerUrl.includes('dweb.link') || lowerUrl.includes('/ipfs/');
  if (!isIpfs) return false;

  const urlPath = url.split('?')[0].split('#')[0];
  const hasExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(urlPath);

  return !hasExtension;
}

interface Props {
  src?: string;
  enableLightBox?: boolean;
}

export function AssetImage({ src, enableLightBox }: Props) {
  const { formatMessage } = useIntl();
  const { openLightbox, renderLightbox } = useLightbox();

  return (
    <>
      {src &&
        renderLightbox({
          slides: [
            {
              src: ipfsUriToUrl(src),
              alt: "Image zoomed",
            },
          ],
          render: { buttonNext: () => null, buttonPrev: () => null },
        })}
      {src && (
        <Box
          onClick={enableLightBox ? openLightbox : undefined}
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%",
            cursor: enableLightBox ? "zoom-in" : "default",
            transition: "all 0.2s ease-in-out",
            "&:hover": enableLightBox ? {
              transform: "scale(1.02)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            } : {},
          }}
        >
          {isIpfsUrlWithoutExtension(src) ? (
            <Box
              component="img"
              src={ipfsUriToUrl(src)}
              alt={formatMessage({
                id: "nft.image",
                defaultMessage: "NFT Image",
              })}
              loading="lazy"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit"
              }}
            />
          ) : isWhitelistedDomain(src) ? (
            <Image
              src={ipfsUriToUrl(src)}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                objectFit: "cover",
                borderRadius: "inherit"
              }}
              alt={formatMessage({
                id: "nft.image",
                defaultMessage: "NFT Image",
              })}
            />
          ) : (
            <Image
              src={ipfsUriToUrl(src)}
              unoptimized={true}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                objectFit: "cover",
                borderRadius: "inherit"
              }}
              alt={formatMessage({
                id: "nft.image",
                defaultMessage: "NFT Image",
              })}
            />
          )}
          {enableLightBox && (
            <Tooltip title={formatMessage({
              id: "click.to.zoom",
              defaultMessage: "Click to zoom"
            })}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox();
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  opacity: 0.8,
                  transition: "opacity 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    opacity: 1,
                  },
                }}
                size="small"
              >
                <ZoomIn />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
      {!src && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%",
          }}
        >
          <Avatar
            alt={"No image"}
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {" "}
            No image available
          </Avatar>
        </Box>
      )}
    </>
  );
}
