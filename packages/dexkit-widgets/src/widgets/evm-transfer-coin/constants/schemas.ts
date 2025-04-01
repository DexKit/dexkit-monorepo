import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import * as Yup from "yup";

export const AddAccountSchema = Yup.object().shape({
  name: Yup.string(),
  address: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
});

export const TransferNftSchema = Yup.object().shape({
  address: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
});
