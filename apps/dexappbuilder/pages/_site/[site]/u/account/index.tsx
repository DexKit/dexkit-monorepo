import MainLayout from '@dexkit/ui/components/layouts/main';
import { default as DynamicImport } from 'next/dynamic';

// Import the component dynamically to avoid SSR issues
const AccountHomePageComponent = DynamicImport(
  () => import('@/modules/account/AccountHomePageComponent'),
  { ssr: false }
);

export default function UserAccountPage() {
  return (
    <MainLayout>
      <AccountHomePageComponent />
    </MainLayout>
  );
}

// Prevent prerendering by returning no paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
