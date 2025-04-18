import { useCallback, useState } from 'react';

import { Box, Dialog, DialogProps } from '@mui/material';

import { useRouter } from 'next/router';
import { useMobile } from '../../hooks/misc';
import Slider from '../Slider';

const SLIDES_TEXTS: { title: string; description: string }[] = [
  {
    title: 'Super App DexKit',
    description:
      'You can manage all your ERC, BEP and POLY assets from any internet connected device.',
  },
  {
    title: 'Maximum control over your finances',
    description:
      'Buy, trade or exchange cryptocurrencies from the platform and manage them as you prefer.',
  },
  {
    title: 'Enjoy all your NFTs',
    description:
      'As a designer or enthusiast, you will be able to see all your non-fungible tokens in just one place, no matter the Blockchain.',
  },
  {
    title: 'Affiliate program',
    description:
      'Earn passive income by inviting your friends to use the platform.',
  },
];

interface WelcomeDialogProps {
  DialogProps: DialogProps;
}

export const WelcomeDialog = ({ DialogProps }: WelcomeDialogProps) => {
  const { onClose } = DialogProps;

  const [index, setIndex] = useState(0);

  const router = useRouter();

  const handleGoLogin = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }

    router.push('/');
  }, [onClose, router]);

  const handleChangeIndex = useCallback((newIndex: number) => {
    setIndex(newIndex);
  }, []);

  const handleSelectIndex = useCallback((newIndex: number) => {
    setIndex(newIndex);
  }, []);

  const handleNext = useCallback(() => {
    setIndex((value) => {
      return value + 1 > 0 && value + 1 <= 3 ? value + 1 : value;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setIndex((value) => {
      return value - 1 >= 0 ? value - 1 : value;
    });
  }, []);

  const isMobile = useMobile();

  return (
    <Dialog {...DialogProps} fullScreen={isMobile}>
      <Slider
        slideCount={4}
        index={index}
        onChangeIndex={handleChangeIndex}
        onSelectIndex={handleSelectIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
        description={SLIDES_TEXTS[index].description}
        title={SLIDES_TEXTS[index].title}
        onStart={handleGoLogin}
      >
        <Box m={1}>
          <Box
            sx={{
              height: 'auto',
              width: '100%',
              minHeight: (theme) => theme.spacing(40),
            }}
          ></Box>
        </Box>
        <Box m={1}>asdasd2</Box>
        <Box m={1}>asdasd3</Box>
        <Box m={1}>asdae4</Box>
      </Slider>
    </Dialog>
  );
};

export default WelcomeDialog;
