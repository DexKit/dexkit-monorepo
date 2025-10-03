import { useIsMobile } from '@dexkit/core';
import { CarouselFormType } from '@dexkit/ui/modules/wizard/types/section';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Pagination from './Pagination';
import Slide from './Slide';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export interface CarouselProps {
  section: {
    type: string;
    settings: CarouselFormType;
  };
}

export default function CarouselSection({ section }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const isMobile = useIsMobile();

  const {
    interval,
    slides,
    height,
    paddingTop,
    paddingBottom,
    pagination,
    navigation,
  } = section.settings;

  const handleChangeIndex = (index: number, indexLatest: number) => {
    setIndex(index);
  };

  const handleNext = () => {
    if (index + 1 === slides?.length) {
      return setIndex(0);
    }

    setIndex((index: any) => index + 1);
  };

  const handlePrev = () => {
    if (index - 1 === -1) {
      return setIndex(slides?.length - 1);
    }

    setIndex((index: any) => index - 1);
  };

  const getArrowIcons = (arrowStyle: string | undefined) => {
    switch (arrowStyle) {
      case 'chevron':
        return { left: ChevronLeftIcon, right: ChevronRightIcon };
      case 'triangle':
        return { left: PlayArrowIcon, right: PlayArrowOutlinedIcon };
      case 'circle':
        return { left: RadioButtonUncheckedIcon, right: RadioButtonCheckedIcon };
      case 'square':
        return { left: CropSquareIcon, right: CropSquareOutlinedIcon };
      default:
        return { left: KeyboardArrowLeftIcon, right: KeyboardArrowRightIcon };
    }
  };

  const { left: LeftIcon, right: RightIcon } = getArrowIcons(navigation?.arrowStyle);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? height?.mobile || 250 : height?.desktop || 500,
        overflow: 'hidden',
        '&:hover .navigation-button': {
          opacity: navigation?.showOnHover ? (navigation?.opacity || 0.8) : undefined,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          paddingTop: `${(paddingTop || 0) * 8}px`,
          paddingBottom: `${(paddingBottom || 0) * 8}px`,
        }}
      >
        <AutoPlaySwipeableViews
          index={index}
          onChangeIndex={handleChangeIndex}
          interval={interval}
          enableMouseEvents
        >
          {(() => {
            if (!slides || slides.length === 0) {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                  }}
                >
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      No slides available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please add at least one slide to the carousel
                    </Typography>
                  </Box>
                </Box>
              );
            }

            return slides.map((slide, slideIndex: number) => (
              <Slide
                key={slideIndex}
                title={slide.title || `Slide ${slideIndex + 1}`}
                subtitle={slide.subtitle}
                imageUrl={slide.imageUrl}
                textColor={slide.textColor}
                height={height}
                overlayColor={slide.overlayColor}
                overlayPercentage={slide.overlayPercentage}
                action={slide.action}
                imageScaling={slide.imageScaling || 'cover'}
                imagePosition={slide.imagePosition || 'center'}
                visualEffect={slide.visualEffect}
                effectIntensity={slide.effectIntensity}
                effectSpeed={slide.effectSpeed}
                effectDirection={slide.effectDirection}
              />
            ));
          })()}
        </AutoPlaySwipeableViews>

        {slides && slides.length > 1 && navigation && navigation.show && (
          <>
            <IconButton
              onClick={handlePrev}
              disabled={index === 0}
              className="navigation-button"
              sx={{
                position: 'absolute',
                left: navigation.position === 'outside' ? -60 : 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                color: navigation.color || '#ffffff',
                backgroundColor: navigation.backgroundColor || 'rgba(0, 0, 0, 0.5)',
                borderRadius: navigation.borderRadius || 5,
                opacity: navigation.showOnHover ? 0 : (navigation.opacity || 0.8),
                '&:hover': {
                  backgroundColor: navigation.hoverBackgroundColor || 'rgba(0, 0, 0, 0.7)',
                  opacity: navigation.hoverOpacity || 1,
                },
                '&:disabled': {
                  opacity: 0.3,
                },
                width: navigation.size === 'small' ? 32 : navigation.size === 'large' ? 48 : 40,
                height: navigation.size === 'small' ? 32 : navigation.size === 'large' ? 48 : 40,
                transition: 'opacity 0.3s ease',
                '@media (max-width: 600px)': {
                  left: navigation.position === 'outside' ? -40 : 8,
                  width: navigation.size === 'small' ? 28 : navigation.size === 'large' ? 40 : 32,
                  height: navigation.size === 'small' ? 28 : navigation.size === 'large' ? 40 : 32,
                },
              }}
            >
              <LeftIcon
                sx={{
                  fontSize: navigation.size === 'small' ? 16 : navigation.size === 'large' ? 24 : 20,
                  '@media (max-width: 600px)': {
                    fontSize: navigation.size === 'small' ? 14 : navigation.size === 'large' ? 20 : 16,
                  },
                }}
              />
            </IconButton>
            <IconButton
              onClick={handleNext}
              disabled={index === slides.length - 1}
              className="navigation-button"
              sx={{
                position: 'absolute',
                right: navigation.position === 'outside' ? -60 : 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                color: navigation.color || '#ffffff',
                backgroundColor: navigation.backgroundColor || 'rgba(0, 0, 0, 0.5)',
                borderRadius: navigation.borderRadius || 5,
                opacity: navigation.showOnHover ? 0 : (navigation.opacity || 0.8),
                '&:hover': {
                  backgroundColor: navigation.hoverBackgroundColor || 'rgba(0, 0, 0, 0.7)',
                  opacity: navigation.hoverOpacity || 1,
                },
                '&:disabled': {
                  opacity: 0.3,
                },
                width: navigation.size === 'small' ? 32 : navigation.size === 'large' ? 48 : 40,
                height: navigation.size === 'small' ? 32 : navigation.size === 'large' ? 48 : 40,
                transition: 'opacity 0.3s ease',
                '@media (max-width: 600px)': {
                  right: navigation.position === 'outside' ? -40 : 8,
                  width: navigation.size === 'small' ? 28 : navigation.size === 'large' ? 40 : 32,
                  height: navigation.size === 'small' ? 28 : navigation.size === 'large' ? 40 : 32,
                },
              }}
            >
              <RightIcon
                sx={{
                  fontSize: navigation.size === 'small' ? 16 : navigation.size === 'large' ? 24 : 20,
                  '@media (max-width: 600px)': {
                    fontSize: navigation.size === 'small' ? 14 : navigation.size === 'large' ? 20 : 16,
                  },
                }}
              />
            </IconButton>
          </>
        )}

        {slides && slides.length > 1 && pagination && (
          <Pagination
            dots={slides.length}
            index={index}
            onChangeIndex={setIndex}
            pagination={pagination}
          />
        )}
      </Box>
    </Box>
  );
}
