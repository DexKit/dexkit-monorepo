import { useCallback } from 'react';

import { Box, ButtonBase, Typography } from '@mui/material';

import Lock from '@/modules/common/components/icons/Lock';
import { KittygotchiTraitType } from '../constants';
import { KittygotchiTraitItem } from '../types/index';
import { getImageFromTraitIcon } from '../utils';

interface TraitSelectorItemProps {
  traitType: KittygotchiTraitType;
  item: KittygotchiTraitItem;
  selected: boolean;
  locked?: boolean;
  onClick: (item: KittygotchiTraitItem) => void;
  disabled?: boolean;
}

export const TraitSelectorItem = (props: TraitSelectorItemProps) => {
  const { item, selected, locked, traitType, onClick, disabled } = props;

  const handleClick = useCallback(() => {
    onClick(item);
  }, [onClick, item]);

  return (
    <ButtonBase
      disabled={locked || disabled}
      sx={(theme) => ({
        borderRadius: '50%',
        width: theme.spacing(16),
        height: theme.spacing(16),
        '&:disabled': {
          backgrdound: theme.palette.grey[700],
        },
      })}
      onClick={handleClick}
    >
      {selected ? (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.action.selected,
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: theme.spacing(16),
            height: theme.spacing(16),
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              backgroundColor: theme.palette.grey[700],
            },
          })}
        >
          <Box
            sx={(theme) => ({
              borderRadius: '50%',
              width: theme.spacing(8),
              height: theme.spacing(8),
            })}
          >
            <img
              alt="trait"
              src={getImageFromTraitIcon(traitType, item.value)}
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Box>
      ) : locked ? (
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: theme.spacing(16),
              height: theme.spacing(16),
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            })}
          >
            <img
              alt=""
              src={getImageFromTraitIcon(traitType, item.value)}
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>
          <Box
            sx={(theme) => ({
              position: 'absolute',
              left: 0,
              top: 0,
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              width: theme.spacing(16),
              height: theme.spacing(16),
            })}
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock />
              </Box>
              <Typography variant="caption">{item.holding} KIT</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: theme.spacing(16),
              height: theme.spacing(16),
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            })}
          >
            <img
              alt="trait"
              src={getImageFromTraitIcon(traitType, item.value)}
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Box>
      )}
    </ButtonBase>
  );
};

export default TraitSelectorItem;
