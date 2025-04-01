import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { BigNumber } from "ethers";
import * as Yup from "yup";

export const TransferNftERC721Schema = Yup.object().shape({
  address: Yup.string()
    .test("address", async function (value) {
      if (value && value.split(".").length > 1) {
        /* const provider = NETWORK_PROVIDER(ChainId.Ethereum);
         const resolveName = await provider?.resolveName(value);
         if (resolveName) {
           return true
         } else {
           return false;
         }*/
        return true;
      }
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
});

export const getTransferNftSchema = ({
  protocol,
  balance,
}: {
  protocol?: "ERC721" | "ERC1155";
  balance?: BigNumber;
}) => {
  if (protocol === "ERC1155" && balance) {
    return Yup.object().shape({
      quantity: Yup.number().min(1).max(balance.toNumber()).required(),
    });
  } else {
    return;
  }
};
