// in pages/index.tsx
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/modules/admin/dashboard'), {
  ssr: false,
});

const Home: NextPage = () => {
  return <App />;
};

export default Home;
