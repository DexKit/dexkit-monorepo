import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import * as Yup from 'yup';

export const ContractFormSchema = Yup.object().shape({
  chainId: Yup.number(),
  abi: Yup.array(),
  contractAddress: Yup.string()
    .test('address', (value, context) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
  fields: Yup.object({}),
});

export const MintNFTSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().optional(),
  background_color: Yup.string().url().optional(),
  animation_url: Yup.string().url().optional(),
  image: Yup.string().url().optional(),
  external_url: Yup.string().url().optional(),
});

export const CreateCollectionFormSchema = Yup.object().shape({
  network: Yup.string(),
  address: Yup.string()
    .test('address', (value, context) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
});
