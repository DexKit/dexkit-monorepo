import React from 'react';

import SwipeableViews from 'react-swipeable-views';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Box, Button, Grid, Theme, Typography, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useMobile } from '../hooks/misc';
import SliderPagination from './SliderPagination';

interface SliderProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onStart?: () => void;
  onSelectIndex: (index: number) => void;
  onChangeIndex: (index: number) => void;
  children?: React.ReactNode | React.ReactNode[];
  slideCount: number;
  index: number;
  description?: string;
  title?: string;
}

export const Slider = (props: SliderProps) => {
  const {
    children,
    index,
    onSelectIndex,
    onChangeIndex,
    onStart,
    onNext,
    slideCount,
    title,
    description,
  } = props;

  const theme = useTheme();

  const isMobile = useMobile();

  return (
    <Box
      sx={(theme: Theme) => ({
        position: 'relative',
      })}
    >
      <Box
        sx={(theme: Theme) => ({
          padding: theme.spacing(2),
          position: 'absolute',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: 0,
          top: 0,
          bottom: 0,
          [theme.breakpoints.down('sm')]: {
            background: `linear-gradient(269.32deg, rgba(13, 16, 23, 0) 12.88%, ${theme.palette.background.paper} 50%)`,
          },
          [theme.breakpoints.up('sm')]: {
            background: `linear-gradient(180deg, rgba(13, 16, 23, 0) 0%, ${theme.palette.background.paper} 50%)`,
          },
        })}
      >
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                align={isMobile ? 'center' : undefined}
                gutterBottom
                variant={isMobile ? 'h6' : 'h5'}
              >
                {title}
              </Typography>
              <Box minHeight={theme.spacing(15)}>
                <Typography
                  align={isMobile ? 'center' : undefined}
                  variant={isMobile ? 'body2' : 'body1'}
                  color="textSecondary"
                >
                  {description}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <SliderPagination
                onSelectIndex={onSelectIndex}
                dots={slideCount}
                index={index}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth={isMobile}
                size={isMobile ? 'small' : 'medium'}
                startIcon={
                  index === slideCount - 1 ? null : <ArrowForwardIcon />
                }
                color="primary"
                onClick={index === slideCount - 1 ? onStart : onNext}
                variant="contained"
              >
                {index === slideCount - 1 ? (
                  <FormattedMessage id="common.start" defaultMessage="Start" />
                ) : (
                  <FormattedMessage
                    id="common.continue"
                    defaultMessage="Continue"
                  />
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <SwipeableViews index={index} onChangeIndex={onChangeIndex}>
        {children}
      </SwipeableViews>
    </Box>
  );
};

export default Slider;
