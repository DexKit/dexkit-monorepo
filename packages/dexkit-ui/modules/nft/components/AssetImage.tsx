import { ipfsUriToUrl } from "@dexkit/core/utils";
import { Avatar, Box } from "@mui/material";
import Image from "next/image";
import { useIntl } from "react-intl";
import useLightbox from "../../../components/lightBox/useLightBox";
import { isWhitelistedDomain } from "../../../utils/image";

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
            cursor: "pointer",
          }}
        >
          {isWhitelistedDomain(src) ? (
            <Image
              src={ipfsUriToUrl(src)}
              fill
              style={{
                position: "absolute",
                top: 0,
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
              style={{
                position: "absolute",
                top: 0,
              }}
              alt={formatMessage({
                id: "nft.image",
                defaultMessage: "NFT Image",
              })}
            />
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
