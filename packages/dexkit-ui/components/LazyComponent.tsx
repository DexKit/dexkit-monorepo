import { Skeleton } from '@mui/material';
import React from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  children: React.ReactNode;
}

const LazyComponent = ({ children }: Props) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref}>
      {inView ? children as any : <Skeleton height={400}></Skeleton>}
    </div>
  );
};

export default LazyComponent;
