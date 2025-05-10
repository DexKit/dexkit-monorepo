import { useSearchSwapTokens } from '@/modules/swap/hooks';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { getChainSlug } from '@dexkit/core/utils/blockchain';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';
import { Avatar, Checkbox, Chip, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Token } from 'src/types/blockchain';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Props {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  featuredTokens?: Token[];
  value: Token[];
  onChange: (tokens: Token[]) => void;
}

export function SearchMultiTokenAutocomplete(props: Props) {
  const { data, label, onChange, chainId, disabled, featuredTokens, value } =
    props;

  const [search, setSearch] = useState<string>('');

  const tokensQuery = useSearchSwapTokens({
    keyword: search,
    network: getChainSlug(chainId),
    featuredTokens:
      featuredTokens && chainId
        ? featuredTokens.filter((tk) => tk.chainId === chainId)
        : featuredTokens,
  });

  const options = useMemo(() => {
    return tokensQuery.tokens.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [tokensQuery.tokens]);

  const { formatMessage } = useIntl();

  const [focus, setFocus] = useState(false);

  return (
    <Autocomplete
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          label={
            focus ? (
              <FormattedMessage id="token.s" defaultMessage="Token(s)" />
            ) : (
              <FormattedMessage
                id="search.token.s"
                defaultMessage="Search token(s)"
              />
            )
          }
          placeholder={
            focus
              ? undefined
              : formatMessage({
                  id: 'search.tokens',
                  defaultMessage: 'Search tokens',
                })
          }
          onChange={(ev) => setSearch(ev.currentTarget.value)}
        />
      )}
      limitTags={2}
      multiple
      value={value}
      onChange={(e, value) => onChange(value)}
      getOptionLabel={(opt) =>
        `${opt.name} (${opt.symbol.toUpperCase()}) - ${
          NETWORKS[opt.chainId].name
        }`
      }
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            avatar={<Avatar src={option.logoURI} />}
            key={index}
            label={option.name}
          />
        ));
      }}
      renderOption={(props, option, { selected }) => {
        const { ...optionProps } = props;
        return (
          <li {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                src={option.logoURI}
                sx={{ width: '1rem', height: '1rem' }}
              />
              <span>
                {option.name} ({option.symbol.toUpperCase()}) -{' '}
                {NETWORKS[option.chainId].name}
              </span>
            </Stack>
          </li>
        );
      }}
    />
  );
}
