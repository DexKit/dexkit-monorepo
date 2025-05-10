import { Box, IconButton, Stack, Typography } from '@mui/material';

import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
import { FormattedMessage } from 'react-intl';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useCallback } from 'react';
import PageGatedConditionSplitButton from './PageGatedConditionSplitButton';

export interface PageGatedConditionsListItemProps {
  condition: GatedCondition;
  index: number;
  onRemove: () => void;
  onEdit: () => void;
  onChange: (condition: GatedCondition, index: number) => void;
}

export default function PageGatedConditionsListItem({
  condition,
  index,
  onEdit,
  onRemove,
  onChange,
}: PageGatedConditionsListItemProps) {
  const handleChange = useCallback(
    (condition: GatedCondition) => {
      onChange(condition, index);
    },
    [index, onChange, condition],
  );

  return (
    <Box>
      <Stack spacing={1}>
        {condition.condition && index > 0 && (
          <Box>
            <PageGatedConditionSplitButton
              condition={condition}
              onChange={handleChange}
            />
          </Box>
        )}
        <Box
          sx={{
            borderLeft: (theme) => `2px solid ${theme.palette.divider}`,
            px: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography fontWeight="bold" variant="body1">
              <FormattedMessage
                id="condition.index"
                defaultMessage="Condition {index}"
                values={{ index: index + 1 }}
              />
            </Typography>
            <IconButton onClick={onEdit} size="small">
              <EditOutlinedIcon />
            </IconButton>
            <IconButton onClick={onRemove} size="small">
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
          {condition.type === 'collection' && (
            <>
              <Typography
                fontWeight="500"
                variant="body2"
                color="text.secondary"
              >
                <FormattedMessage
                  id="collection.index.message"
                  defaultMessage="Collection: {collection}"
                  values={{
                    collection: (
                      <Typography
                        variant="inherit"
                        component="span"
                        fontWeight="400"
                      >
                        {condition?.name ?? ''}
                      </Typography>
                    ),
                  }}
                />
              </Typography>

              <Typography
                fontWeight="500"
                variant="body2"
                color="text.secondary"
              >
                <FormattedMessage
                  id="required.quantity.index"
                  defaultMessage="Required quantity: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        component="span"
                        fontWeight="400"
                      >
                        {condition.amount}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            </>
          )}

          {condition.type === 'coin' && (
            <>
              <Typography
                fontWeight="500"
                variant="body2"
                color="text.secondary"
              >
                <FormattedMessage
                  id="token.collection.text"
                  defaultMessage="Token: {collection}"
                  values={{
                    collection: (
                      <Typography
                        variant="inherit"
                        component="span"
                        fontWeight="400"
                      >
                        {condition?.name ?? ''}
                      </Typography>
                    ),
                  }}
                />
              </Typography>

              <Typography
                fontWeight="500"
                variant="body2"
                color="text.secondary"
              >
                <FormattedMessage
                  id="required.quantity.index"
                  defaultMessage="Required quantity: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        component="span"
                        fontWeight="400"
                      >
                        {condition.amount} {condition.symbol}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
