import { List } from '@mui/material';
import { useMemo } from 'react';
import { useDebounce } from '../../../../hooks/misc';
import { Token } from '../../../../types/blockchain';
import { TOKEN_KEY } from '../../utils';
import TokensSectionListItem from './TokensSectionListItem';

interface Props {
  tokens: Token[];
  search: string;
  appUrl?: string;
  selectable?: boolean;
  selectedKeys: { [key: string]: boolean };
  onSelect: (key: string) => void;
  onMakeTradable?: (key: string) => void;
  onDisableFeatured?: (key: string) => void;
}

export default function TokensSectionList({
  tokens,
  selectable,
  selectedKeys,
  onSelect,
  appUrl,
  onMakeTradable,
  onDisableFeatured,
  search,
}: Props) {
  const lazySearch = useDebounce<string>(search?.toLowerCase(), 500);

  const filteredTokens = useMemo(() => {
    if (!tokens) {
      return [];
    }

    return tokens.filter((t) => {
      return (
        t.name.toLowerCase().search(lazySearch) > -1 ||
        t.symbol.toLowerCase().search(lazySearch) > -1
      );
    });
  }, [tokens, lazySearch]);

  return (
    <List disablePadding>
      {filteredTokens.map((token, index, arr) => (
        <TokensSectionListItem
          appUrl={appUrl}
          divider={index < arr.length - 1}
          key={index}
          token={token}
          selectable={selectable}
          onClick={() => onSelect(TOKEN_KEY(token))}
          disableMakeTradable={onMakeTradable === undefined}
          disableFeatured={onDisableFeatured === undefined}
          onMakeTradable={() => {
            if (onMakeTradable) {
              onMakeTradable(TOKEN_KEY(token));
            }
          }}
          onDisableFeatured={() => {
            if (onDisableFeatured) {
              onDisableFeatured(TOKEN_KEY(token));
            }
          }}
          selected={selectedKeys[TOKEN_KEY(token)]}
        />
      ))}
    </List>
  );
}
