import { ethers } from 'ethers';
import * as Yup from 'yup';

export const AddAccountSchema = Yup.object().shape({
  name: Yup.string(),
  address: Yup.string()
    .test('address', (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
});

export const TransferNftSchema = Yup.object().shape({
  address: Yup.string()
    .test('address', (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
});
