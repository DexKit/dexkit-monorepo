import { URL_REGEX } from '@/modules/common/constants';
import * as Yup from 'yup';

export const CollectionFormSchema = Yup.object().shape({
  file: Yup.mixed().required(),
  name: Yup.string().required(),
  symbol: Yup.string().required(),
  description: Yup.string().optional(),
  url: Yup.string().matches(URL_REGEX, 'URL').optional(),
});

export const CollectionItemsSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().optional(),
      file: Yup.mixed().required(),
      attributes: Yup.array().of(
        Yup.object().shape({
          trait_type: Yup.string().required(),
          display_type: Yup.string(),
          value: Yup.string().required(),
        })
      ),
    })
  ),
});

export const CollectionItemsFormSchema = Yup.object().shape({});

export const CollectionItemAttributeFormSchema = Yup.object().shape({
  type: Yup.string().optional(),
  name: Yup.string().required(),
  value: Yup.string().required(),
});

export const TokenFormSchema = Yup.object().shape({
  symbol: Yup.string().required(),
  name: Yup.string().required(),
  maxSupply: Yup.number().required(),
});
