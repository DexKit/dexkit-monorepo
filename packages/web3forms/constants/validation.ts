import { arrayify } from "@dexkit/core/utils/ethers/arrayify";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { isBytesLike } from "@dexkit/core/utils/ethers/isBytesLike";
import * as Yup from "yup";

export const EvmSchemaTypes: { [key: string]: Yup.Schema } = {
  uint256: Yup.string().max(32).required(),
  string: Yup.string().required(),
  bytes: Yup.string().required(),
  bool: Yup.bool().required(),
  bytes32: Yup.string()
    .test("bytes32", "invalid bytes32", (value) => {
      return (
        value !== undefined &&
        isBytesLike(value) &&
        arrayify(value).length === 32
      );
    })
    .required(),
  "address[]": Yup.array(
    Yup.string().test("address", "invalid address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    }),
  ).required(),
  address: Yup.string()
    .test("address", "invalid address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
};

export const PATTERN_TWO_DIGITS_AFTER_COMMA = /^\d+(\.\d{0,18})?$/;
