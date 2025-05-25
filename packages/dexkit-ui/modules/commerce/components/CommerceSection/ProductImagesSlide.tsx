import { ButtonBase, Grid, IconButton, Stack, styled } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// Import Swiper styles
import { useRef } from "react";
import "swiper/css";

import type { Swiper as SwiperType } from "swiper/types";

function chunkArray<T>(arr: T[], size: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const ImageThumbButton = styled(ButtonBase)(({ theme }) => ({
  height: "auto",
  width: "100%",
  aspectRatio: "1/1",
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.grey[200]}`,

  backgroundColor: theme.palette.background.paper,
}));

const Image = styled("img")(({ theme }) => ({
  height: "100%",
  width: "100%",
  objectFit: "cover",
  aspectRatio: "1/1",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[200]}`,

  backgroundColor: theme.palette.background.paper,
}));

export interface ProductImagesSlideProps {
  onSelectImage: (image: string) => void;
  images: {
    id: string;
    imageUrl: string;
  }[];
}

export default function ProductImagesSlide({
  onSelectImage,
  images,
}: ProductImagesSlideProps) {
  const swiper = useRef<SwiperType | null>(null);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <IconButton onClick={() => swiper.current?.slidePrev()}>
        <NavigateBeforeIcon />
      </IconButton>
      <Swiper
        onSwiper={(ref) => {
          swiper.current = ref;
        }}
        slidesPerView={1}
        spaceBetween={16}
      >
        {chunkArray(images ?? [], 4).map((r, i) => {
          return (
            <SwiperSlide key={i}>
              <Grid container spacing={2}>
                {r?.map((image, j) => (
                  <Grid item xs={3} key={`${i}-${j}`}>
                    <ImageThumbButton
                      onClick={() => onSelectImage(image.imageUrl)}
                    >
                      <Image src={image.imageUrl} />
                    </ImageThumbButton>
                  </Grid>
                ))}
              </Grid>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <IconButton onClick={() => swiper.current?.slideNext()}>
        <NavigateNextIcon />
      </IconButton>
    </Stack>
  );
}
