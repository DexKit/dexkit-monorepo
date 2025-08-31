import { default as DynamicImport } from 'next/dynamic';
import AuthMainLayout from 'src/components/layouts/authMain';

// Import the component dynamically to avoid SSR issues
const ViewFormPageComponent = DynamicImport(
  () => import('@/modules/forms/ViewFormPageComponent'),
  { ssr: false }
);

export default function ViewFormPage() {
  return <ViewFormPageComponent />;
}

(ViewFormPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};

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
