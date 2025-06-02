import { ThemeMode } from '@dexkit/ui/constants/enum';
import {
  AbiFragment,
  ContractFormField,
  ContractFormFieldInputWithTupleParams,
} from '@dexkit/web3forms/types';
import {
  createTheme,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import get from 'lodash/get';
import set from 'lodash/set';
import { getTheme } from 'src/theme';
import { Token } from '../../../types/blockchain';

import { AppCollection } from '@dexkit/ui/modules/wizard/types/config';
import { FeeForm } from '../components/sections/FeesSectionForm';
import { MAX_FEES } from '../constants';
import { CustomThemeColorSchemesInterface } from '../state';

export function totalInFees(fees: FeeForm[]) {
  return fees.reduce((prev, current) => current.amountPercentage + prev, 0.0);
}

export function isBelowMaxFees(fees: FeeForm[], maxFee: number = MAX_FEES) {
  if (maxFee > 10 || maxFee < 0) {
    return false;
  }

  const total = totalInFees(fees);

  return total <= maxFee;
}

export function TOKEN_KEY(token: Token) {
  return `${token.chainId}-${token.address.toLowerCase()}`;
}

export function APP_COLLECTION_KEY(collection: AppCollection) {
  return `${collection.chainId}-${collection.contractAddress.toLowerCase()}`;
}

export function generateTheme({
  selectedFont,
  selectedThemeId,
  customTheme,
  mode,
}: {
  selectedFont?: { family?: string; category?: string };
  selectedThemeId: string;
  customTheme?: CustomThemeColorSchemesInterface;
  mode?: ThemeMode;
}) {
  let fontFamily;
  if (selectedFont) {
    fontFamily = `'${selectedFont.family}', ${selectedFont.category}`;
  }

  if (selectedThemeId === 'custom') {
    let paletteTheme =
      mode === ThemeMode.dark
        ? customTheme?.colorSchemes?.dark
        : customTheme?.colorSchemes?.light;
    return fontFamily
      ? createTheme({
        typography: {
          fontFamily,
        },
        ...paletteTheme,
      })
      : createTheme({
        ...paletteTheme,
      });
  }
  const theme = getTheme({ name: selectedThemeId }).theme;
  let paletteTheme =
    mode === ThemeMode.dark
      ? theme.colorSchemes.dark
      : theme.colorSchemes.light;
  return fontFamily
    ? createTheme({
      typography: {
        fontFamily,
      },
      ...paletteTheme,
    })
    : createTheme({
      typography: {
        fontFamily,
      },
      ...paletteTheme,
    });
}

export function generateCSSVarsTheme({
  selectedFont,
  selectedThemeId,
  customTheme,
  cssVarPrefix,
}: {
  selectedFont?: { family?: string; category?: string };
  selectedThemeId: string;
  customTheme?: CustomThemeColorSchemesInterface;
  mode?: ThemeMode;
  cssVarPrefix?: string;
}) {
  let fontFamily;
  if (selectedFont) {
    fontFamily = `'${selectedFont.family}', ${selectedFont.category}`;
  }

  if (selectedThemeId === 'custom') {
    return fontFamily
      ? extendTheme({
        ...customTheme,
        cssVarPrefix: cssVarPrefix,
        typography: {
          fontFamily,
        },
      })
      : extendTheme({ ...customTheme, cssVarPrefix });
  }

  const theme = getTheme({ name: selectedThemeId }).theme;

  return fontFamily
    ? extendTheme({
      cssVarPrefix: cssVarPrefix,
      typography: {
        fontFamily,
      },
      colorSchemes: theme.colorSchemes,
    })
    : extendTheme({
      cssVarPrefix: cssVarPrefix,
      colorSchemes: theme.colorSchemes,
    });
}

export function inputMapping(abi: AbiFragment[]) {
  let fields: {
    [key: string]: ContractFormField;
  } = {};

  for (let item of abi) {
    if (item.name) {
      let inputs: {
        [key: string]: ContractFormFieldInputWithTupleParams;
      } = {};
      for (let inp of item.inputs) {
        inputs[inp.name] = {
          defaultValue: '',
          label: inp.name,
          inputType: 'normal',
        };
      }

      fields[item.name] = {
        name: item.name,
        input: inputs,
        description: '',
        callOnMount: false,
        lockInputs: false,
        visible: false,
        collapse: false,
        hideInputs: false,
        hideLabel: false,
        output: { type: '' },
        callToAction: '',
      };
    }
  }

  return fields;
}

export function requiredField(message: string) {
  return (value: string) => {
    return !value ? message : undefined;
  };
}

export function mapObject(
  obj: any,
  other: any,
  keys: { [key: string]: string }
) {
  for (const key of Object.keys(keys)) {
    set(obj, key, get(other, keys[key]));
  }
}
