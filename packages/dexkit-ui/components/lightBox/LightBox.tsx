import LightboxComponent, {
  LightboxExternalProps,
} from "yet-another-react-lightbox";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

/**
 * The purpose of this intermediate component is to load the Lightbox and
 * its CSS dynamically only when the lightbox becomes interactive
 */
export default function Lightbox(props: LightboxExternalProps) {


  return (
    <LightboxComponent
      {...props}
      plugins={[Zoom]}
      animation={{ zoom: 500 }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 4,
        keyboardMoveDistance: 50,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
        scrollToZoom: true,
      }}
    />
  );
}
