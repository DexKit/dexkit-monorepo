import type { CellPlugin } from "@react-page/editor";
import CarouselSection from "../../sections/CarouselSection";

export const CarouselPlugin: CellPlugin<any> = {
  Renderer: ({ data, isEditMode }) => {
    if (!data) {
      return <></>;
    }

    if (data.slides && Array.isArray(data.slides)) {
      data.slides.forEach((slide: any, index: number) => {
      });
    }

    return (
      <CarouselSection
        section={{
          type: "carousel",
          settings: {
            slides: data.slides || [],
            interval: data.interval,
            height: data.height,
            paddingTop: data.paddingTop,
            paddingBottom: data.paddingBottom,
            pagination: data.pagination,
            navigation: data.navigation,
          },
        }}
      />
    );
  },
  id: "carousel-plugin",
  title: "Carousel",
  description: "Image carousel with advanced scaling options and configurable visual effects",
  version: 2,
};

export default CarouselPlugin;
