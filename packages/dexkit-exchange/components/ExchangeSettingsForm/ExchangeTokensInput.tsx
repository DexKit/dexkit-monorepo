import {
  Avatar,
  AvatarGroup,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";

import { ChainId, TOKEN_ICON_URL } from "@dexkit/core";
import { DexkitExchangeSettings } from "types";

export interface ExchangeTokensInputProps {
  chainId?: ChainId;
}

export default function ExchangeTokensInput({
  chainId,
}: ExchangeTokensInputProps) {
  const { setFieldValue, values, errors } =
    useFormikContext<DexkitExchangeSettings>();

  const [isEdit, setIsEdit] = useState(false);

  const pairList = useMemo(() => {
    let pairs = [];

    if (chainId) {
      for (let quoteToken of values.defaultTokens[chainId]?.quoteTokens || []) {
        for (let baseToken of values.defaultTokens[chainId]?.baseTokens || []) {
          pairs.push({ baseToken, quoteToken });
        }
      }
    }

    return pairs;
  }, [values.defaultTokens, chainId]);

  return (
    <>
      <Paper>
        <List disablePadding>
          {pairList.map((pair, key) => (
            <ListItem divider key={key}>
              <Box mr={1}>
                <AvatarGroup>
                  <Avatar
                    src={
                      pair.baseToken.logoURI
                        ? pair.baseToken.logoURI
                        : TOKEN_ICON_URL(
                            pair.baseToken.address,
                            pair.baseToken.chainId,
                          )
                    }
                  />
                  <Avatar
                    src={
                      pair.quoteToken.logoURI
                        ? pair.baseToken.logoURI
                        : TOKEN_ICON_URL(
                            pair.quoteToken.address,
                            pair.quoteToken.chainId,
                          )
                    }
                  />
                </AvatarGroup>
              </Box>
              <ListItemText
                primary={`${pair.baseToken.symbol.toUpperCase()}/${pair.quoteToken.symbol.toUpperCase()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
