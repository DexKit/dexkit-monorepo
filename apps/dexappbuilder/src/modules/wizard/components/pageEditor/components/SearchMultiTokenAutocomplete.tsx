import { useSearchSwapTokens } from '@/modules/swap/hooks';
import { useIsMobile } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { getChainSlug } from '@dexkit/core/utils/blockchain';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';
import { Avatar, Checkbox, Chip, Stack, useTheme } from '@mui/material';
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
  const isMobile = useIsMobile();
  const theme = useTheme();

  const tokensQuery = useSearchSwapTokens({
    keyword: search,
    network: getChainSlug(chainId),
    featuredTokens:
      featuredTokens && chainId
        ? featuredTokens.filter((tk) => tk.chainId === chainId)
        : featuredTokens,
  });

  const options = useMemo(() => {
    return tokensQuery.tokens.sort((a: any, b: any) => {
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
          size={isMobile ? "small" : "medium"}
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
          onChange={(ev: any) => setSearch(ev.currentTarget.value)}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: isMobile ? theme.typography.body2.fontSize : undefined
            }
          }}
        />
      )}
      limitTags={isMobile ? 1 : 2}
      multiple
      value={value}
      onChange={(e, value) => onChange(value)}
      getOptionLabel={(opt) =>
        `${opt.name} (${opt.symbol.toUpperCase()}) - ${NETWORKS[opt.chainId]?.name || 'Unknown Network'
        }`
      }
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            avatar={<Avatar src={option.logoURI} sx={{
              width: isMobile ? theme.spacing(2.25) : theme.spacing(3),
              height: isMobile ? theme.spacing(2.25) : theme.spacing(3)
            }} />}
            key={index}
            label={option.name}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? theme.typography.caption.fontSize : undefined,
              height: isMobile ? theme.spacing(3) : undefined
            }}
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
              style={{
                marginRight: theme.spacing(1),
                padding: isMobile ? theme.spacing(0.5) : theme.spacing(1)
              }}
              size={isMobile ? "small" : "medium"}
              checked={selected}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={theme.spacing(1)}
              sx={{ fontSize: isMobile ? theme.typography.caption.fontSize : undefined }}>
              <Avatar
                src={option.logoURI}
                sx={{
                  width: isMobile ? theme.spacing(1) : theme.spacing(1.25),
                  height: isMobile ? theme.spacing(1) : theme.spacing(1.25)
                }}
              />
              <span>
                {option.name} ({option.symbol.toUpperCase()}) -{' '}
                {NETWORKS[option.chainId]?.name || 'Unknown Network'}
              </span>
            </Stack>
          </li>
        );
      }}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          fontSize: isMobile ? theme.typography.body2.fontSize : undefined
        },
        '& .MuiAutocomplete-option': {
          minHeight: isMobile ? theme.spacing(4.5) : undefined,
          padding: isMobile ? `${theme.spacing(0.5)} ${theme.spacing(1)}` : undefined
        }
      }}
    />
  );
}
