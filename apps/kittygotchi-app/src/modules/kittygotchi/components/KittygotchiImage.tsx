import mergeImages from 'merge-images';
import { useEffect, useState } from 'react';

import { Box } from '@mui/material';

interface Props {
  images: string[];
}

export const KittygotchiImage = (props: Props) => {
  const { images } = props;
  const [imgB64, setImgB64] = useState<string>();

  useEffect(() => {
    mergeImages(images.map((i) => ({ src: i })))
      .then((b64: string) => {
        setImgB64(b64);
      })
      .catch((err: any) => {
        console.log('ERROR bs65', err);
      });
    /* eslint-disable */
  }, [JSON.stringify(images)]);

  if (imgB64 !== undefined) {
    return (
      <img
        alt=""
        src={imgB64}
        style={{ width: '100%', height: '100%' }}
        crossOrigin="anonymous"
      />
    );
  }

  return <Box></Box>;
};

export default KittygotchiImage;
