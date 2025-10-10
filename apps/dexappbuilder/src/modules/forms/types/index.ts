import { ChainId } from '@dexkit/core';
import { AbiFragment } from '@dexkit/web3forms/types';
import * as Yup from 'yup';
import { CreateTemplateSchema } from '../constants';

export type FormTemplate = {
  id: number;
  creatorAddress: string;
  bytecode: string;
  abi: AbiFragment[];
  name: string;
  description: string;
};

export type CreateTemplateSchemaType = Yup.Asserts<typeof CreateTemplateSchema>;

export type TemplateInstance = {
  id: number;
  createdAt: string;
  updatedAt: string;
  contractFormTemplatesId: number;
  name: string;
  description: string;
  chainId: ChainId;
  creatorAddress: string;
  address: string;
};

export type DeployedContract = {
  name: string;
  contractAddress: string;
  owner: string;
  id: number;
  type?: string;
  chainId?: number;
  hide?: boolean;
  createdAt?: string;
};
