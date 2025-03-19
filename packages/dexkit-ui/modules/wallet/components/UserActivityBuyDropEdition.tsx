import { getBlockExplorerUrl } from "@dexkit/core/utils";
import { Link } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useEdition } from "../../nft/hooks/thirdweb";
import { UserEvent } from "../hooks/useUserActivity";

export interface UserActivityBuyDropEditionProps {
  event: UserEvent;
}

export default function UserActivityBuyDropEdition({
  event,
}: UserActivityBuyDropEditionProps) {
  const { price, token, collection, tokenId } = event.processedMetadata;

  const editionQuery = useEdition({
    contractAddress: collection,
    chainId: event.chainId ? event.chainId : undefined,
  });

  return (
    <>
      <FormattedMessage
        id="buy.edition.drop.for"
        defaultMessage="Buy Drop Edition {collectionName} {tokenId} for {price} {tokenSymbol}"
        values={{
          collectionName: (
            <Link
              href={`${getBlockExplorerUrl(
                event.chainId ? event.chainId : undefined,
              )}/address/${collection}`}
            >
              <strong>{editionQuery.data?.name}</strong>
            </Link>
          ),
          price: <strong>{price}</strong>,
          tokenId: <strong>{tokenId}</strong>,
          tokenSymbol: <strong>{token?.symbol}</strong>,
        }}
      />
    </>
  );
}
